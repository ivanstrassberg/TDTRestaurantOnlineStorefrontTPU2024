package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type Storage interface {
	RegisterCustomer(string, string) (bool, error)
	LoginCustomer(string, string) (bool, error)
	GetCustomers() ([]*Customer, error)
}

type PostgresStore struct {
	db *sql.DB
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
	// s.createCategoryTable()
	s.createCartTable()
	s.createCartProductJunctionTable()
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
	//cart_id int default NULL,
	//--foreign key (cart_id) references cart(id) ?
	// fmt.Println(query)
	// q := `alter table customer add column cart_id int`
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
		description varchar(1000),

		
	)`
	_, err := s.db.Exec(query)
	if err != nil {
		return err
	}
	return err
}

func (s *PostgresStore) createCartProductJunctionTable() error {
	query := `CREATE TABLE if not exists cart_product (
		cart_id INTEGER,  
		product_id INTEGER,  
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

func (s *PostgresStore) RegisterCustomer(email string, password string) (bool, error) {
	// query := `select * from customer where (email = $1)`
	// resp, err := s.db.Query(query, email)
	// fmt.Println((resp))
	check, err := s.ifExists(email)
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
	check, _ := s.ifExists(email)
	// fmt.Println(check)
	// if err != nil {
	// 	return false, err
	// }
	if check == false {
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

func (s *PostgresStore) GetCustomers() ([]*Customer, error) {
	query := `select * from customer`
	rows, err := s.db.Query(query)
	fmt.Println(rows)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	customers := []*Customer{}
	for rows.Next() {
		customer, err := scanIntoCustomer(rows)
		if err != nil {
			return nil, err
		}
		customers = append(customers, customer)
	}

	return customers, nil
}

func scanIntoCustomer(rows *sql.Rows) (*Customer, error) {
	customer := new(Customer)
	err := rows.Scan(
		&customer.ID,
		&customer.Email,
		&customer.PasswordHash,
		&customer.DeliveryAddress,
		&customer.CreatedAt)

	return customer, err
}

func (s *PostgresStore) ifExists(email string) (bool, error) {
	var exists int
	query := `
	select
	  case
	  	when exists (select 1 from customer where email = $1)
		then 1
		else 0
	  end as user_exists
	`
	err := s.db.QueryRow(query, email).Scan(&exists)
	// fmt.Println(err, exists, email)
	if err != nil {
		return false, err
	}
	if exists == 0 {
		return false, nil
	}
	return true, nil
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
