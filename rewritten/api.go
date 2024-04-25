package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

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
	mux.HandleFunc("/index", makeHTTPHandleFunc(s.handleMain))
	mux.HandleFunc("/login", makeHTTPHandleFunc(s.handleLogin))
	mux.HandleFunc("/register", makeHTTPHandleFunc(s.handleRegister))

	log.Println("JSON API server running on port", s.listenAddr)
	if err := http.ListenAndServe(s.listenAddr, mux); err != nil {
		log.Fatalf("Error starting server: %s\n", err)
	}
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
		resp, err := s.store.LoginCustomer(regReq.Email, regReq.PasswordHash)
		// err := s.store.RegisterCustomer(regReq.Email, regReq.PasswordHash)
		if err != nil {
			return WriteJSON(w, http.StatusBadRequest, ApiError{Error: "does not exist, or wrong password"})
		}
		fmt.Println(resp)
		if resp {
			WriteJSON(w, http.StatusOK, "exists")
			return nil
		}
		// used to bypass CORS now obsolete
		// sf, err := json.Marshal(regReq)
		// if err != nil {
		// 	return err
		// }

		// w.Header().Set("Content-Type", "application/json")
		// w.Write(sf)
		// return WriteJSON(w, http.StatusNotFound, "not found")

	}
	return nil
}

func (s *APIServer) handleRegister(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		s.serveFileByURL(w, r)
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
		if err := s.store.RegisterCustomer(regReq.Email, ph); err != nil {
			return err
		}
		return WriteJSON(w, http.StatusOK, CustomerLR{
			regReq.Email, ph,
		})
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

type APIfunc func(http.ResponseWriter, *http.Request) error

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
