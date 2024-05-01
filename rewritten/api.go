package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	jwt "github.com/golang-jwt/jwt"
	bcrypt "golang.org/x/crypto/bcrypt"
)

type APIServer struct {
	listenAddr string
	store      Storage
	staticDir  string
}

func NewAPIServer(listenAddr string, store Storage, staticDir string) *APIServer {
	return &APIServer{
		listenAddr: listenAddr,
		store:      store,
		staticDir:  staticDir,
	}
}

func enableCors(w *http.ResponseWriter) {
	header := (*w).Header()
	header.Set("Access-Control-Allow-Origin", "*")
	header.Set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
	header.Set("Access-Control-Allow-Headers", "Content-Type, X-Authorization, X-Requested-With, email")
	header.Set("Access-Control-Allow-Credentials", "true")
	// WriteJSON(*w, http.StatusOK, header)
}
func (s *APIServer) Run() {

	mux := http.NewServeMux()
	// mux = corsMiddleware(mx)
	mux.HandleFunc("/admin/{action}/{type}", withJWTauthAdmin(makeHTTPHandleFunc(s.handleAdmin))) // post: add/delete/update-category/product; get:
	mux.HandleFunc("/admin", withJWTauthAdmin(makeHTTPHandleFunc(s.handleAdmin)))
	mux.HandleFunc("/products", (makeHTTPHandleFunc(s.handleProducts)))
	mux.HandleFunc("/cart/{action}/{id}", withJWTauth(makeHTTPHandleFunc(s.handleCartActions)))
	mux.HandleFunc("/cart", withJWTauth(makeHTTPHandleFunc(s.handleCart)))
	mux.HandleFunc("/product/{id}", (makeHTTPHandleFunc(s.handleProductByID)))
	mux.HandleFunc("/index", withJWTauth(makeHTTPHandleFunc(s.handleMain)))
	mux.HandleFunc("/account/{id}", withJWTauth(makeHTTPHandleFunc(s.handleAccount)))
	mux.HandleFunc("/login", (makeHTTPHandleFunc(s.handleLogin)))
	mux.HandleFunc("/register", (makeHTTPHandleFunc(s.handleRegister)))

	log.Println("JSON API server running on port", s.listenAddr)
	if err := http.ListenAndServe(s.listenAddr, mux); err != nil {
		log.Fatalf("Error starting server: %s\n", err)
	}
}

func (s *APIServer) handleCart(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (s *APIServer) handleCartActions(w http.ResponseWriter, r *http.Request) error {
	action := r.PathValue("action")
	id, _ := strconv.Atoi(r.PathValue("id"))
	email := r.Header.Get("email")
	switch action {
	case "add":
		s.store.AddProductToCustomerCart(id, email)
	case "delete":

	default:
		WriteJSON(w, http.StatusBadRequest, ApiError{Error: "action not supported"})
	}

	return nil
}

func (s *APIServer) handleAdmin(w http.ResponseWriter, r *http.Request) error {
	action := r.PathValue("action")
	typeOf := r.PathValue("type")
	if r.Method == "GET" {
		if action == "get" {
			// switch typeOf {
			// case "customer":
			resp, _ := s.store.GetFromDB(typeOf)
			WriteJSON(w, http.StatusOK, resp)
			// }
		}
	}
	if r.Method == "POST" {
		switch action {
		case "add":
			switch typeOf {
			case "product":
				req := new(Product)
				err := json.NewDecoder(r.Body).Decode(req)
				if err != nil {
					return err
				}
				check, _ := s.store.IfExists("product", "name", req.Name)
				if !check {
					err := s.store.AddProduct(req.Name, req.Description, req.Price, req.Stock, req.Category_ID)
					if err != nil {
						return err
					}
					check, _ = s.store.IfExists("product", "name", req.Name)
					if check {
						WriteJSON(w, http.StatusAccepted, "product created")
						return nil
					}
				}
				WriteJSON(w, http.StatusBadRequest, ApiError{Error: "product already exists"})
				return nil
			case "category":
				req := new(ReqCategory)
				err := json.NewDecoder(r.Body).Decode(req)
				if err != nil {
					return err
				}
				check, _ := s.store.IfExists("category", "name", req.Name)
				if !check {
					err := s.store.AddCategory(req.Name, req.Description)
					if err != nil {
						return err
					}
					// fmt.Println(resp)
					check, _ = s.store.IfExists("category", "name", req.Name)
					if check {
						WriteJSON(w, http.StatusAccepted, "category created")
						return nil
					}
					WriteJSON(w, http.StatusBadRequest, "something went wrong")
					return nil
				}
				WriteJSON(w, http.StatusBadRequest, ApiError{Error: "category already exists"})
				return nil
			}
		case "delete":
			fmt.Println("deleting a ...")
			switch typeOf {
			case "product":
				req := new(Product)
				err := json.NewDecoder(r.Body).Decode(req)
				if err != nil {
					return err
				}
				check, _ := s.store.IfExists("product", "name", req.Name)
				if check {
					err := s.store.DeleteProduct(req.Name)
					if err != nil {
						return err
					}
					check, _ = s.store.IfExists("product", "name", req.Name)
					if !check {

						return WriteJSON(w, http.StatusAccepted, "product deleted")
					}
				}
				return WriteJSON(w, http.StatusBadRequest, ApiError{Error: "product does not exist"})
			case "category":
				fmt.Println(typeOf)
			}
			// default:
			// 	WriteJSON(w, http.StatusBadRequest, "the action not supported")
		}

		// WriteJSON(w, http.StatusOK, nil)
		// fmt.Println(r.Header)
		// token := r.Header.Get("X-Authorization")
		// fmt.Println(token)
		// // }

	}
	return nil
}

func (s *APIServer) handleProducts(w http.ResponseWriter, r *http.Request) error {
	products, err := s.store.GetFromDB("product")
	if err != nil {
		return WriteJSON(w, http.StatusBadRequest, "failed to fetch products")
	}

	// Write products as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
	return nil
}

func (s *APIServer) handleProductByID(w http.ResponseWriter, r *http.Request) error {
	idStr := r.PathValue("id")
	// fmt.Println(idStr)
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return err
	}
	if check, _ := s.store.IfExists("product", "id", id); !check {
		WriteJSON(w, http.StatusBadRequest, "does not exist")
	}
	product, err := s.store.GetFromDBByID("product", id)
	if err != nil {
		return WriteJSON(w, http.StatusBadRequest, "failed to fetch product")
	}

	// Write products as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
	return nil
}

func (s *APIServer) handleAccount(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (s *APIServer) handleMain(w http.ResponseWriter, r *http.Request) error {
	// enableCors(&w)
	// http.ServeFile(w, r, "/Users/ivansilin/Documents/coding/golang/foodShop/initHandle/static/index.html")
	// s.serveFileByURL(w, r)
	return nil
}

func (s *APIServer) handleLogin(w http.ResponseWriter, r *http.Request) error {

	if r.Method == "POST" {

		regReq := new(CustomerLR)
		if err := json.NewDecoder(r.Body).Decode(regReq); err != nil {
			return err
		}
		// password, err := HashPassword(regReq.PasswordHash)
		// if err != nil {
		// 	return err
		// }
		// fmt.Println(regReq.Email, password)
		// hashed, err := HashPassword(regReq.PasswordHash)
		// todo rework that, return the password, then de-hash and compare
		//  confirm if all good
		passDB, err := s.store.GetPassword(regReq.Email)
		if err != nil {
			return err
		}
		// shit, _ := HashPassword(regReq.PasswordHash)
		fmt.Println(regReq.Email, regReq.PasswordHash, passDB)
		check := HashToPassword(passDB, regReq.PasswordHash)
		// check := CheckPasswordHash(regReq.PasswordHash, passDB)
		fmt.Println(check)
		// check := true
		if check {
			resp, err := s.store.LoginCustomer(regReq.Email, passDB)

			if err != nil {
				WriteJSON(w, http.StatusBadRequest, ApiError{Error: "does not exist, or wrong password"})
				return err
			}
			// fmt.Println(resp)
			if resp {
				token, err := generateJWT(regReq.Email)
				if err != nil {
					return err
				}
				// fmt.Println(token, "<- this mf dont wanna stick to header")
				w.Header().Set("X-Authorization", token)
				WriteJSON(w, http.StatusOK, token)
				return nil
			}
		}
		WriteJSON(w, http.StatusBadRequest, "something went wrong")
		return nil
	}
	return WriteJSON(w, http.StatusNotFound, "http method not supported")
}

func (s *APIServer) handleRegister(w http.ResponseWriter, r *http.Request) error {
	// if r.Method == "GET" {
	// 	// s.serveFileByURL(w, r)
	// 	// fmt.Println(s.store.IfExists("customer", "email", "ias115@tpu.ru"))
	// 	// err := s.store.RegisterCustomer(regReq.Email, regReq.PasswordHash)
	// }
	if r.Method == "POST" {
		regReq := new(CustomerLR)
		if err := json.NewDecoder(r.Body).Decode(regReq); err != nil {
			return err
		}

		// ph, err := HashPassword(regReq.PasswordHash)
		ph, err := HashPassword(regReq.PasswordHash)

		if err != nil {
			return err
		}
		check := isCommonMailDomain(regReq.Email)
		if regReq.Email == " " || !check {
			WriteJSON(w, http.StatusBadRequest, ApiError{Error: "wrong email format"})
			return nil
		}
		v, err := s.store.RegisterCustomer(regReq.Email, ph)
		if err != nil {
			return err
		}
		if v {
			return WriteJSON(w, http.StatusOK, CustomerLR{
				regReq.Email, "",
			})
		}
		WriteJSON(w, http.StatusBadRequest, ApiError{Error: "the email is already in use"})
		return nil
	}
	// if r.Method == "DELETE" {
	// 	users, err := s.store.GetFromDB("customer")
	// 	if err != nil {
	// 		return err
	// 	}
	// 	for i := 0; i < len(users); i++ {
	// 		fmt.Println(users[i])
	// 	}
	// }

	return nil
}

func makeHTTPHandleFunc(f APIfunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		if err := f(w, r); err != nil {
			WriteJSON(w, http.StatusBadRequest, ApiError{Error: err.Error()})
		}

	}
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

type ApiError struct {
	Error string `json:"error"`
}

func (s *APIServer) serveFileByURL(w http.ResponseWriter, r *http.Request) error {
	path := r.URL.Path
	parts := strings.Split(path, "/")
	endpoint := parts[len(parts)-1]
	file := s.staticDir + endpoint + ".html"
	_, err := os.Stat(file)
	// fmt.Println(file)
	if err != nil {
		return err
	}

	http.ServeFile(w, r, file)
	return nil
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
func HashToPassword(hash, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

var jwtKey = []byte("testKey") // later get that to the ENV var

func generateJWT(email string) (string, error) {
	// expirationTime := time.Now().Add(5 * time.Minute)
	claims := &Claims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 60).Unix(), // * 60
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(jwtKey))

}

func validateJWT(tokenString string) (*jwt.Token, error) {
	// secret := os.Getenv("JWT_SECRET")
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("wrong")
		}
		return []byte(jwtKey), nil
	})
}

func withJWTauth(handleFunc http.HandlerFunc) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		fmt.Println("calling jwt middleware")
		tokenString := r.Header.Get("X-Authorization")
		// fmt.Println(tokenString)
		token, err := validateJWT(tokenString)
		if err != nil {
			WriteJSON(w, http.StatusUnauthorized, ApiError{Error: "forbidden"})
			return
		}
		emailString := r.Header.Get("email")
		checkEmail, err := ParseJWT(tokenString)
		if err != nil {
			WriteJSON(w, http.StatusUnauthorized, ApiError{Error: "forbidden"})
			return
		}
		// fmt.Println(emailString, checkEmail, "check if email's the same")

		if emailString == checkEmail && token.Valid {
			WriteJSON(w, http.StatusOK, "Welcome!")
			handleFunc(w, r)
			return
		}

		WriteJSON(w, http.StatusUnauthorized, ApiError{Error: "forbidden"})
	}
}

func withJWTauthAdmin(handleFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		tokenString := r.Header.Get("X-Authorization")
		token, err := validateJWT(tokenString)
		if err != nil {
			WriteJSON(w, http.StatusUnauthorized, ApiError{Error: "forbidden"})
			return
		}
		emailString := r.Header.Get("email")
		checkEmail, err := ParseJWT(tokenString)
		if err != nil {
			WriteJSON(w, http.StatusUnauthorized, ApiError{Error: "forbidden"})
			return
		}
		if emailString == checkEmail && checkEmail == "admin@gmail.com" && token.Valid {
			WriteJSON(w, http.StatusOK, "Welcome!")
			handleFunc(w, r)
			return
		}

		WriteJSON(w, http.StatusUnauthorized, ApiError{Error: "forbidden"})
	}

}

func ParseJWT(tokenString string) (string, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Method)
		}
		return []byte(jwtKey), nil
	})
	if err != nil {
		return "", err
	}
	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}
	return claims.Email, nil
}

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

type APIfunc func(http.ResponseWriter, *http.Request) error

var commonEmailDomains = []string{
	"gmail.com",
	"yahoo.com",
	"outlook.com",
	"hotmail.com",
	"live.com",
	"aol.com",
	"icloud.com",
	"mail.ru",
	"tpu.ru",
	"inbox.ru",
}

func isCommonMailDomain(email string) bool {
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return false
	}

	domain := parts[1]
	for _, commonDomain := range commonEmailDomains {
		if strings.EqualFold(domain, commonDomain) {
			return true
		}
	}

	return false
}
