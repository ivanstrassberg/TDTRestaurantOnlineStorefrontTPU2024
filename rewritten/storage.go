package main

import (
	"database/sql"
	"errors"
	"fmt"

	_ "github.com/lib/pq"
)

type Storage interface {
	RegisterCustomer(string, string) (bool, error)
	LoginCustomer(string, string) (bool, error)
	GetFromDB(string) ([]DBEntity, error)
	GetFromDBByID(string, int) ([]DBEntity, error)
	AddProduct(string, string, float64, int, int) error
	// GetCustomers() ([]*Customer, error)
	DeleteProduct(string) error
	DeleteCategory(string) error
	IfExists(string, string, any) (bool, error)
	AddCategory(string, string) error
}

type DBEntity interface{}

type PostgresStore struct {
	db *sql.DB
}

func (s *PostgresStore) AddProduct(name string, desc string, price float64, stock int, cat_id int) error {
	query := `insert into product (name, description, price, stock, rating, category_id) values ($1, $2, $3, $4, 0, $5)`
	_, err := s.db.Query(query, name, desc, price, stock, cat_id)
	if err != nil {
		return err
	}
	return nil
}

func (s *PostgresStore) DeleteProduct(name string) error {
	query := `delete from product where name = $1`
	_, err := s.db.Query(query, name)
	if err != nil {
		return err
	}
	return nil
}

func (s *PostgresStore) AddCategory(name string, desc string) error {
	query := `insert into category (name, description) values ($1, $2)`
	resp, err := s.db.Query(query, name, desc)
	if err != nil {
		return err
	}
	fmt.Println(resp)
	return nil
}

func (s *PostgresStore) DeleteCategory(name string) error {
	query := `delete from category where name = $1`
	_, err := s.db.Query(query, name)
	if err != nil {
		return err
	}
	return nil
}

func NewPostgresStorage() (*PostgresStore, error) {
	connStr := "user=postgres port=5433 dbname=foodMarket password=root sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		// log.Panic()
		return nil, err
	}
	return &PostgresStore{
		db: db,
	}, nil
}

func (s *PostgresStore) Init() error {
	fmt.Println("Initializing DB...")
	s.createProductTable()
	s.createCustomerTable()
	s.createCategoryTable()
	s.createCartTable()
	s.createCartProductJunctionTable()
	s.createOrderTable()
	s.createOrderProductJunctionTable()
	fmt.Println("DB Initialized.")
	// s.createConstraints()
	return nil
}

func (s *PostgresStore) createProductTable() error { // todo add constraints to the category
	query := `create table if not exists product (
		id serial primary key,
		name varchar(120),
		description varchar(1000),
		price decimal,
		stock integer,
		rating decimal,
		category_id integer,
		foreign key (category_id) references category(id)
	)`
	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) createCustomerTable() error { // todo add constraints to the cart
	query := `create table if not exists customer (
		id serial primary key,
		email varchar(100) not null unique,
		password_hash varchar(120) not null,
		delivery_address varchar(500) default 'none',
		created_at timestamp default current_timestamp
	)`

	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) createCartTable() error {
	query := `
		create table if not exists cart (
			id serial primary key,
			customer_id int,
			foreign key (customer_id) references customer(id) on delete cascade
		)
	`
	_, err := s.db.Exec(query)
	if err != nil {
		return err
	}

	triggerQuery :=
		`
		CREATE OR REPLACE FUNCTION create_cart_for_customer() 
		RETURNS trigger AS $$
		BEGIN
			INSERT INTO cart (customer_id) VALUES (NEW.id);
			RETURN NEW;  
		END;
		$$ LANGUAGE plpgsql;  
		
		CREATE TRIGGER after_customer_insert
		AFTER INSERT ON customer 
		FOR EACH ROW  
		EXECUTE FUNCTION create_cart_for_customer();`
	_, err = s.db.Exec(triggerQuery)
	if err != nil {
		return err
	}
	return nil
}

func (s *PostgresStore) createCategoryTable() error {
	query := `create table if not exists category (
		id serial primary key,
		name varchar(120),
		description varchar(500)
	)`
	_, err := s.db.Exec(query)
	if err != nil {
		return err
	}
	return err
}

func (s *PostgresStore) createCartProductJunctionTable() error {
	query := `CREATE TABLE if not exists cart_product (
		cart_id int,  
		product_id int,  
		PRIMARY KEY (cart_id, product_id),  
		FOREIGN KEY (cart_id) REFERENCES cart(id),  
		FOREIGN KEY (product_id) REFERENCES product(id)  
	);`
	_, err := s.db.Exec(query)
	if err != nil {
		return err
	}
	return nil
}

func (s *PostgresStore) createOrderTable() error {
	query := `create table if not exists customer_order (
		id serial primary key, 
		customer_id int not null default 0, 
		foreign key (customer_id) references customer(id),
		total decimal default 0.0, 
		status int not null, 
		is_cash boolean not null default FALSE,
		created_at timestamp default current_timestamp
	);`
	_, err := s.db.Exec(query)
	if err != nil {
		return err
	}
	return nil
}

func (s *PostgresStore) createOrderProductJunctionTable() error {
	query := `CREATE TABLE if not exists order_product (
		order_id int,  
		product_id int,  
		PRIMARY KEY (order_id, product_id),  
		FOREIGN KEY (order_id) REFERENCES customer_order(id),  
		FOREIGN KEY (product_id) REFERENCES product(id)  
	);`
	_, err := s.db.Exec(query)
	if err != nil {
		return err
	}
	return nil
}

func (s *PostgresStore) RegisterCustomer(email string, password string) (bool, error) {
	// query := `select * from customer where (email = $1)`
	// resp, err := s.db.Query(query, email)
	// fmt.Println((resp))
	check, err := s.IfExists("customer", "email", email)
	if err != nil {
		return false, err
	}
	if !check {
		query := `insert into customer (email, password_hash) values ($1,$2)`
		_, err1 := s.db.Exec(query, email, password)
		if err1 != nil {
			return false, err1
		}
		return true, nil
	}

	return false, nil
}

func (s *PostgresStore) LoginCustomer(email string, password string) (bool, error) {
	check, _ := s.IfExists("customer", "email", email)
	// fmt.Println(check)
	// if err != nil {
	// 	return false, err
	// }
	if !check {
		return false, nil
	}
	check2, err := s.checkCustomer(email, password)
	// fmt.Println("this is a check", check2)
	if err != nil {
		return false, err
	}

	return check2, nil
}

// func (s *PostgresStore) createConstraints() error {
// 	return nil
// }

// func (s *PostgresStore) GetCustomers() ([]*Customer, error) {
// 	query := `select * from customer`
// 	rows, err := s.db.Query(query)
// 	fmt.Println(rows)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()
// 	customers := []*Customer{}
// 	for rows.Next() {
// 		customer, err := scanIntoCustomer(rows)
// 		if err != nil {
// 			return nil, err
// 		}
// 		customers = append(customers, customer)
// 	}

// 	return customers, nil
// }

func (s *PostgresStore) GetFromDB(table string) ([]DBEntity, error) {
	validTables := map[string]bool{
		"customer": true,
		"product":  true,
		"category": true,
	}
	if !validTables[table] {
		return nil, fmt.Errorf("invalid table: %s", table)
	}
	query := fmt.Sprintf("SELECT * FROM %s", table)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	results := []DBEntity{}

	switch table {
	case "product":
		for rows.Next() {
			product, err := scanIntoProduct(rows)
			if err != nil {
				return nil, err
			}
			results = append(results, product)
		}
	case "customer":
		for rows.Next() {
			customer, err := scanIntoCustomer(rows)
			if err != nil {
				return nil, err
			}
			results = append(results, customer)
		}
	case "category":
		for rows.Next() {
			category, err := scanIntoCategory(rows)
			if err != nil {
				return nil, err
			}
			results = append(results, category)
		}
	default:
		return nil, errors.New("unknown table: " + table)
	}

	return results, nil
}

func (s *PostgresStore) GetFromDBByID(table string, id int) ([]DBEntity, error) {
	validTables := map[string]bool{
		"customer": true,
		"product":  true,
		"category": true,
	}
	if !validTables[table] {
		return nil, fmt.Errorf("invalid table: %s", table)
	}
	query := fmt.Sprintf("SELECT * FROM %s where id = %v", table, id)

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	results := []DBEntity{}

	switch table {
	case "product":
		for rows.Next() {
			product, err := scanIntoProduct(rows)
			if err != nil {
				return nil, err
			}
			results = append(results, product)
		}
	case "customer":
		for rows.Next() {
			customer, err := scanIntoCustomer(rows)
			if err != nil {
				return nil, err
			}
			results = append(results, customer)
		}
	case "category":
		for rows.Next() {
			category, err := scanIntoCategory(rows)
			if err != nil {
				return nil, err
			}
			results = append(results, category)
		}
	default:
		return nil, errors.New("unknown table: " + table)
	}

	return results, nil
}

func scanIntoProduct(rows *sql.Rows) (*Product, error) {
	var product Product
	err := rows.Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.Stock, &product.Rating, &product.Category_ID)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func scanIntoCustomer(rows *sql.Rows) (*Customer, error) {
	var customer Customer
	if err := rows.Scan(&customer.ID, &customer.Email, &customer.PasswordHash, &customer.DeliveryAddress, &customer.CreatedAt); err != nil {
		return nil, err
	}
	return &customer, nil
}

func scanIntoCategory(rows *sql.Rows) (*Category, error) {
	var category Category
	if err := rows.Scan(&category.ID, &category.Name, &category.Description); err != nil {
		return nil, err
	}
	return &category, nil
}

func (s *PostgresStore) IfExists(table string, column string, target any) (bool, error) {
	validTables := map[string]bool{
		"customer": true,
		"product":  true,
		"category": true,
	}
	if !validTables[table] {
		return false, fmt.Errorf("invalid table: %s", table)
	}
	query := fmt.Sprintf(
		`SELECT
		  CASE
		  	WHEN EXISTS (SELECT 1 FROM %s WHERE %s = $1)
			THEN 1
			ELSE 0
		  END AS exists`,
		table,
		column,
	)

	var exists int
	err := s.db.QueryRow(query, target).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists == 1, nil
}

func (s *PostgresStore) checkCustomer(email, password string) (bool, error) {
	query := `select
	case
		when exists (select 1 from customer where email = $1 and password_hash = $2)
	  then 1
	  else 0
	end as user_exists
  `
	var r int
	err := s.db.QueryRow(query, email, password).Scan(&r)
	if err != nil {
		return false, err
	}
	if r == 0 {
		return false, nil
	}
	return true, nil
}

// func (s *PostgresStore) executeQueryViaDBQuery(query string) {} // todo later
