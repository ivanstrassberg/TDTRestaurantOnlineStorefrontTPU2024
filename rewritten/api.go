package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	jwt "github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
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
	header.Add("Access-Control-Allow-Origin", "*")
	header.Add("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
	header.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
}
func (s *APIServer) Run() {

	mux := http.NewServeMux()
	// mux = corsMiddleware(mx)
	mux.HandleFunc("/admin", withJWTauth(makeHTTPHandleFunc(s.handleAdmin)))
	mux.HandleFunc("/index", withJWTauth(makeHTTPHandleFunc(s.handleMain)))
	mux.HandleFunc("/login", (makeHTTPHandleFunc(s.handleLogin)))
	mux.HandleFunc("/register", (makeHTTPHandleFunc(s.handleRegister)))

	log.Println("JSON API server running on port", s.listenAddr)
	if err := http.ListenAndServe(s.listenAddr, mux); err != nil {
		log.Fatalf("Error starting server: %s\n", err)
	}
}

func (s *APIServer) handleAdmin(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (s *APIServer) handleMain(w http.ResponseWriter, r *http.Request) error {
	// enableCors(&w)
	// http.ServeFile(w, r, "/Users/ivansilin/Documents/coding/golang/foodShop/initHandle/static/index.html")
	// s.serveFileByURL(w, r)
	return nil
}

func (s *APIServer) handleLogin(w http.ResponseWriter, r *http.Request) error {
	// enableCors(&w)
	// if r.Method == "GET" {
	// s.serveFileByURL(w, r)
	// }

	if r.Method == "POST" {

		// fmt.Println("posted")
		regReq := new(CustomerLR)
		if err := json.NewDecoder(r.Body).Decode(regReq); err != nil {
			return err
		}
		// customer := new(Customer)
		///
		///
		fmt.Println(regReq.Email, regReq.PasswordHash)
		// hashed, err := HashPassword(regReq.PasswordHash)
		// todo rework that, return the password, then de-hash and compare
		//  confirm if all good
		resp, err := s.store.LoginCustomer(regReq.Email, regReq.PasswordHash)
		// err := s.store.RegisterCustomer(regReq.Email, regReq.PasswordHash)
		if err != nil {
			return WriteJSON(w, http.StatusBadRequest, ApiError{Error: "does not exist, or wrong password"})
		}
		fmt.Println(resp)
		if resp {
			token, err := generateJWT(regReq.Email)
			if err != nil {
				return nil
			}
			fmt.Println(token)
			w.Header().Set("X-Authorization", token)
			return WriteJSON(w, http.StatusOK, regReq.Email)

			// WriteJSON(w, http.StatusOK, "exists")
			// return nil
		}

	}
	return nil
}

func (s *APIServer) handleRegister(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		// s.serveFileByURL(w, r)
	}
	if r.Method == "POST" {
		regReq := new(CustomerLR)
		if err := json.NewDecoder(r.Body).Decode(regReq); err != nil {
			return err
		}

		ph, err := HashPassword(regReq.PasswordHash)

		if err != nil {
			return err
		}
		v, err := s.store.RegisterCustomer(regReq.Email, ph)
		if err != nil {
			return err
		}
		if v {
			return WriteJSON(w, http.StatusOK, CustomerLR{
				regReq.Email, ph,
			})
		}
		WriteJSON(w, http.StatusBadRequest, ApiError{Error: "the username is taken"})
		return nil
	}
	if r.Method == "DELETE" {
		users, err := s.store.GetCustomers()
		if err != nil {
			return err
		}
		for i := 0; i < len(users); i++ {
			fmt.Println(users[i])
		}
	}

	return nil
}

func makeHTTPHandleFunc(f APIfunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
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
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func generateJWT(email string) (string, error) {
	// expirationTime := time.Now().Add(5 * time.Minute)
	claims := &Claims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 120).Unix(),
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
		fmt.Println("calling jwt middleware")
		tokenString := r.Header.Get("X-Authorization")
		token, err := validateJWT(tokenString)
		if err != nil {
			WriteJSON(w, http.StatusForbidden, ApiError{Error: "forbidden"})
			return
		}
		// userID := s.store.GetUserById
		claims := token.Claims.(jwt.MapClaims)
		fmt.Println(claims)
		handleFunc(w, r)
	}
}

var jwtKey = []byte("testKey") // later get that to the ENV var
var tokens []string

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

type APIfunc func(http.ResponseWriter, *http.Request) error
