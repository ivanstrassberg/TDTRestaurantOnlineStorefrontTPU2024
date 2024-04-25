package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	jwt "github.com/golang-jwt/jwt"
)

type APIServer struct {
	listenAddr string
	store      Storage
}

func NewAPIServer(listenAddr string, store Storage) *APIServer {

	return &APIServer{
		listenAddr: listenAddr,
		store:      store,
	}
}

// @title JSON API Server
// @version 1.0
// @description This is a JSON API server.
// @contact.email your-email@example.com
// @BasePath /api/v1
func (s *APIServer) Run() {
	mux := http.NewServeMux()

	mux.HandleFunc("/main", makeHTTPHandleFunc(s.handleMain))
	mux.HandleFunc("/test", makeHTTPHandleFunc(s.handleTest))
	mux.HandleFunc("/users", makeHTTPHandleFunc(s.handleUsers))
	mux.HandleFunc("/login", makeHTTPHandleFunc(s.handleLogin))
	mux.HandleFunc("/cart", makeHTTPHandleFunc(s.handleActor))
	mux.HandleFunc("/cart/delete", withJWTauth(makeHTTPHandleFunc(s.handleActor)))
	mux.HandleFunc("/item", makeHTTPHandleFunc(s.handleMovie))
	mux.HandleFunc("/item/delete", makeHTTPHandleFunc(s.handleMovie))
	mux.HandleFunc("/item/sort", makeHTTPHandleFunc(s.handleMovie))
	mux.HandleFunc("/item/search/{byName}", makeHTTPHandleFunc(s.handleMovie))
	mux.HandleFunc("/item/sort/{sortParam}/{order}", makeHTTPHandleFunc(s.handleMovie))

	log.Println("JSON API server running on port", s.listenAddr)

	if err := http.ListenAndServe(s.listenAddr, mux); err != nil {
		log.Fatalf("Error starting server: %s\n", err)
	}
}

func (s *APIServer) handleUsers(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		users, err := s.store.GetUsers()
		if err != nil {
			return err
		}
		WriteJSON(w, http.StatusOK, users)
	}
	return nil
}

func (s *APIServer) handleMain(w http.ResponseWriter, r *http.Request) error {
	// http.ServeFile(w, r, "/Users/ivansilin/Documents/coding/golang/foodShop/initHandle/static/styles/index-style.css")
	http.ServeFile(w, r, "/Users/ivansilin/Documents/coding/golang/foodShop/initHandle/static/index.html")

	return nil
}

func (s *APIServer) handleTest(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		http.ServeFile(w, r, "./static/test.html")
		return nil
	}

	if r.Method == "POST" {
		data := new(MainTest)
		err := json.NewDecoder(r.Body).Decode(data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return nil
		}

		data.LastName = "Updated Last Name"

		responseData, err := json.Marshal(data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return nil
		}

		w.Header().Set("Content-Type", "application/json")

		w.WriteHeader(http.StatusOK)
		w.Write(responseData)
		return nil
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	return nil
}

// @summary Handle movie operations
// @description This endpoint handles operations related to movies.
// @tags Movies
func (s *APIServer) handleMovie(w http.ResponseWriter, r *http.Request) error {
	path := r.URL.Path
	parts := strings.Split(path, "/")
	keyWord := parts[len(parts)-1]
	keyWordSortParam := parts[len(parts)-2]

	if r.Method == "GET" {

		if path == "/item" {
			return s.handleGetMoviesDefault(w, r, " ", " ")
		}
		if isEndpointInPath(parts, "search") {
			if keyWord != "" {
				fmt.Println(keyWord)
				return s.handleMovieSearch(w, r, keyWord)
			}
			return WriteJSON(w, http.StatusBadRequest, ApiError{Error: "empty search"})
		}
		if isEndpointInPath(parts, "sort") {
			if keyWord != "" && (isEndpointInPath(parts, "asc") || isEndpointInPath(parts, "desc")) {
				if keyWordSortParam != "" && (isEndpointInPath(parts, "title") || isEndpointInPath(parts, "rating") || isEndpointInPath(parts, "release_date")) {
					return s.handleGetSortedMovies(w, r, keyWordSortParam, keyWord)
				}

			}
			return s.handleGetMoviesDefault(w, r, " ", " ")
		}
		return WriteJSON(w, http.StatusBadRequest, ApiError{Error: "something went wrong during sorting"})

	}

	if r.Method == "POST" {
		return s.handleCreateMovie(w, r)
	}

	if r.Method == "DELETE" {
		if path == "/movie/delete" {
			return s.handleDeleteMovie(w, r)
		} else {
			return s.handleDeleteMovieData(w, r)
		}

	}

	if r.Method == "PUT" {
		return s.handleUpdateMovie(w, r)
	}

	return fmt.Errorf("method not allowed %s", r.Method)
}

// @summary Delete a movie
// @description This endpoint deletes a movie.
// @tags Movies
func (s *APIServer) handleDeleteMovieData(w http.ResponseWriter, r *http.Request) error {
	updateReq := new(UpdateMovieReq)
	if err := json.NewDecoder(r.Body).Decode(updateReq); err != nil {
		return err
	}
	// fmt.Println(updateReq, "handle")
	if err := s.store.DeleteMovieData(updateReq); err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, updateReq)
}

func (s *APIServer) handleMovieSearch(w http.ResponseWriter, r *http.Request, keyWord string) error {
	movies, err := s.store.SearchMovie(keyWord)
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, movies)
}

func (s *APIServer) handleGetSortedMovies(w http.ResponseWriter, r *http.Request, keyWordSortParam, keyWord string) error {
	// fmt.Printf("i got invoked with params %s, %s\n", keyWordSortParam, keyWord)
	movies, err := s.store.GetSortedMovies(keyWordSortParam, keyWord)
	if err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, movies)

}

// @Summary Get movies
// @Description Get a list of movies
// @Tags Movies
// @Accept json
// @Produce json
// @Success 200 {array} Movie
// @Router /movie [get]
func (s *APIServer) handleGetMoviesDefault(w http.ResponseWriter, r *http.Request, keyWordSortParam, keyWord string) error {
	movies, err := s.store.GetSortedMovies(keyWordSortParam, keyWord)
	if err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, movies)
}

// @Summary Create movie
// @Description Create a new movie
// @Tags Movies
// @Accept json
// @Produce json
// @Param movie body CreateMovieReq true "Movie object that needs to be added"
// @Success 200 {object} Movie
// @Router /movie [post]
func (s *APIServer) handleCreateMovie(w http.ResponseWriter, r *http.Request) error {
	createMovieReq := new(CreateMovieReq)
	if err := json.NewDecoder(r.Body).Decode(createMovieReq); err != nil {
		return err
	}
	movie := NewMovie(createMovieReq.Title, createMovieReq.Description, createMovieReq.Rating, createMovieReq.Starring)
	if err := s.store.CreateMovie(movie); err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, movie)
}

func (s *APIServer) handleDeleteMovie(w http.ResponseWriter, r *http.Request) error {
	updateMovieReq := new(UpdateMovieReq)
	if err := json.NewDecoder(r.Body).Decode(updateMovieReq); err != nil {
		return err
	}

	if err := s.store.DeleteMovie(int(updateMovieReq.ID)); err != nil {
		return err
	}
	responseData := make(map[string]interface{})
	if updateMovieReq.ID != 0 {
		responseData["id"] = int(updateMovieReq.ID)
	}

	return WriteJSON(w, http.StatusOK, map[string]interface{}{"deleted": responseData})
}

func (s *APIServer) handleUpdateMovie(w http.ResponseWriter, r *http.Request) error {
	updateReq := new(UpdateMovieReq)

	if err := json.NewDecoder(r.Body).Decode(updateReq); err != nil {
		return err
	}
	// fmt.Println(updateReq, "handle")
	if err := s.store.UpdateMovie(updateReq); err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, updateReq)

}

// func (s *APIServer) handleLogin(w http.ResponseWriter, r *http.Request) error {
// 	if r.Method == "GET" {
// 		userLoginReq := new(LoginRequest)
// 		if err := json.NewDecoder(r.Body).Decode(userLoginReq); err != nil {
// 			return err
// 		}

// 		return WriteJSON(w, http.StatusOK, userLoginReq)
// 	}
// 	if r.Method == "POST" {
// 		userLoginReq := new(LoginRequest)
// 		if err := json.NewDecoder(r.Body).Decode(userLoginReq); err != nil {
// 			return err
// 		}
// 		user := NewUser(userLoginReq.Username, userLoginReq.Password)
// 		if err := s.store.CreateUser(user); err != nil {
// 			return err
// 		}

// 		return WriteJSON(w, http.StatusOK, userLoginReq)
// 	}
// 	return WriteJSON(w, http.StatusOK, ApiError{Error: "method not supported"})

// }

func (s *APIServer) handleActor(w http.ResponseWriter, r *http.Request) error {

	path := r.URL.Path
	// parts := strings.Split(path, "/")
	// keyWord := parts[len(parts)-1]
	// keyWordSortParam := parts[len(parts)-2]

	if r.Method == "GET" {
		return s.handleGetActors(w, r)
	}

	if r.Method == "POST" {
		return s.handleCreateActor(w, r)
	}

	if r.Method == "DELETE" {
		if path == "/actor/delete" {
			return s.handleDeleteActor(w, r)
		} else {
			return s.handleDeleteActorData(w, r)
		}

	}

	if r.Method == "PUT" {
		return s.handleUpdateActor(w, r)
	}

	return fmt.Errorf("method not allowed %s", r.Method)
}

func (s *APIServer) handleDeleteActorData(w http.ResponseWriter, r *http.Request) error {
	updateReq := new(UpdateActorReq)
	if err := json.NewDecoder(r.Body).Decode(updateReq); err != nil {
		return err
	}
	// fmt.Println(updateReq, "handle")
	if err := s.store.DeleteActorData(updateReq); err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, updateReq)

}

func (s *APIServer) handleCreateActor(w http.ResponseWriter, r *http.Request) error {
	createAccountReq := new(CreateActorReq)
	if err := json.NewDecoder(r.Body).Decode(createAccountReq); err != nil {
		return err
	}
	if createAccountReq.FirstName == "" || createAccountReq.LastName == "" || createAccountReq.Sex == "" || len(createAccountReq.StarringIn) == 0 {
		return WriteJSON(w, http.StatusBadRequest, ApiError{Error: "parameters missing"})
	}
	actor := NewActor(createAccountReq.FirstName, createAccountReq.LastName, createAccountReq.Sex, createAccountReq.StarringIn)
	if err := s.store.CreateActor(actor); err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, actor)

}

// @summary Update an actor
// @description This endpoint updates an actor.
// @tags Actors
func (s *APIServer) handleUpdateActor(w http.ResponseWriter, r *http.Request) error {
	updateReq := new(UpdateActorReq)
	if err := json.NewDecoder(r.Body).Decode(updateReq); err != nil {
		return err
	}
	// fmt.Println(updateReq, "handle")
	if err := s.store.UpdateActor(updateReq); err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, updateReq)
}

// @summary Delete an actor
// @description This endpoint deletes an actor.
// @tags Actors
func (s *APIServer) handleDeleteActor(w http.ResponseWriter, r *http.Request) error {
	credentials, err := s.getActorDeletionCredentials(w, r)
	// fmt.Printf("%+v", credentials)
	// dcredentials = json.NewDecoder(r.Body).Decode(credentials)
	if err != nil {
		return err
	}

	if err := s.store.DeleteActor(int(credentials.ID)); err != nil {
		return err
	}

	responseData := make(map[string]interface{})
	if credentials.ID != 0 {
		responseData["id"] = int(credentials.ID)
	}
	// if credentials.FirstName != "" {
	// 	responseData["firstName"] = credentials.FirstName
	// }
	// if credentials.LastName != "" {
	// 	responseData["lastName"] = credentials.LastName
	// }

	return WriteJSON(w, http.StatusOK, map[string]interface{}{"deleted": responseData})

}

func handleUpdateActor() error {
	return nil
}

func (s *APIServer) handleGetActors(w http.ResponseWriter, r *http.Request) error {
	actors, err := s.store.GetActors()
	if err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, actors)
}

// @summary Write JSON response
// @description This function writes a JSON response.
// @tags Utility
func WriteJSON(w http.ResponseWriter, status int, v any) error {

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

type apiFunc func(http.ResponseWriter, *http.Request) error

type ApiError struct {
	Error string `json:"error"`
}

func makeHTTPHandleFunc(f apiFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := f(w, r); err != nil {
			WriteJSON(w, http.StatusBadRequest, ApiError{Error: err.Error()})
		}
	}
}

// // error here FIX or not idk // fixed?
func (s *APIServer) getActorDeletionCredentials(w http.ResponseWriter, r *http.Request) (DeleteActorReq, error) {
	deleteActorReq := new(DeleteActorReq)
	if err := json.NewDecoder(r.Body).Decode(deleteActorReq); err != nil {
		return DeleteActorReq{}, fmt.Errorf("permission denied")
	}
	return *deleteActorReq, nil
}

/*

 */

func getEndpoint(r *http.Request) (string, error) {
	urlPath := r.URL.Path
	pathParts := strings.Split(urlPath, "/")

	endpointStr := pathParts[len(pathParts)-1] // this is ok

	// id, err := strconv.Atoi(endpointStr)
	if endpointStr == "" {
		return "", fmt.Errorf("permission denied: invalid Endpoint ")
	}
	return "", fmt.Errorf("permission denied: invalid endpoint ")
}

func isEndpointInPath(parts []string, endpoint string) bool {
	for _, part := range parts {
		if part == endpoint {
			return true
		}
	}
	return false
}

///////

func (s *APIServer) handleLogin(w http.ResponseWriter, r *http.Request) error {

	if r.Method == "POST" {
		userLoginReq := new(LoginRequest)
		if err := json.NewDecoder(r.Body).Decode(userLoginReq); err != nil {
			return err
		}
		user := NewUser(userLoginReq.Username, userLoginReq.Password)
		if err := s.store.CreateUser(user); err != nil {
			return err
		}

		token, err := assignToken(w, user)
		if err != nil {
			return nil
		}
		w.Header().Set("x-jwt-token", token)
		return WriteJSON(w, http.StatusOK, userLoginReq)
	} else {
		var loginReq LoginRequest
		err := json.NewDecoder(r.Body).Decode(&loginReq)
		if err != nil {

			return WriteJSON(w, http.StatusForbidden, "no")
		}

		checkForUser, errr := s.store.GetUserByUsername(loginReq.Username, loginReq.Password)
		if errr != nil {
			return errr
		}
		token, err := assignToken(w, checkForUser)
		if err != nil {
			return nil
		}
		w.Header().Set("x-jwt-token", token)
		WriteJSON(w, http.StatusAccepted, "login successful")
		// user, err := s.authenticateUser(loginReq.Username, loginReq.Password)
		// if err != nil {
		// 	WriteJSON(w, http.StatusForbidden, "no")
		// }

		// tokenString, err := generateToken(user)
		// if err != nil {
		// 	WriteJSON(w, http.StatusForbidden, "no")
		// }

		// // Return the token to the client
		// w.Header().Set("Content-Type", "application/json")
		// json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
	}
	return nil
}

func assignToken(w http.ResponseWriter, user *User) (string, error) {
	tokenString, err := createJWT(user)
	if err != nil {
		return "", err
	}
	fmt.Printf("tokenstring %s", tokenString)

	return tokenString, nil
}

// func (s *APIServer) authenticateUser(username, password string) (*User, error) {
// 	user := new(User)
// 	user, err := s.store.GetUserById(user.Username, user.Password)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return user, nil
// }

// // generateToken generates JWT token for the user
// func generateToken(user *User) (string, error) {
// 	token := jwt.New(jwt.SigningMethodHS256)

// 	// Set claims
// 	claims := token.Claims.(jwt.MapClaims)
// 	claims["id"] = user.ID
// 	claims["username"] = user.Username
// 	claims["isAdmin"] = user.IsAdmin
// 	claims["exp"] = time.Now().Add(time.Minute * 24).Unix() // Token expires in 24 hours

// 	// Generate encoded token and return it
// 	tokenString, err := token.SignedString([]byte(jwtInstance.SecretKey))
// 	if err != nil {
// 		return "", err
// 	}
// 	return tokenString, nil
// }

func createJWT(user *User) (string, error) {
	claims := &jwt.MapClaims{
		"expiresAt": 15000,
		"userID":    user.ID,
	}
	secret := os.Getenv("JWT-SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzQXQiOjE1MDAwLCJ1c2VySUQiOjB9.jA6_CXcszn1Fy9-gRyyulieEGQQMtlAIyoaulQci8wM for cola123 test123
func withJWTauth(handleFunc http.HandlerFunc) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("calling jwt middleware")
		tokenString := r.Header.Get("x-jwt-token")
		token, err := validateJWT(tokenString)
		if err != nil {
			WriteJSON(w, http.StatusForbidden, ApiError{Error: "invalid"})
			return
		}
		// userID := s.store.GetUserById
		claims := token.Claims.(jwt.MapClaims)
		fmt.Println(claims)
		handleFunc(w, r)
	}
}

// const JWT_SECRET = "test"

func validateJWT(tokenString string) (*jwt.Token, error) {
	secret := os.Getenv("JWT_SECRET")
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("wrong")
		}
		return []byte(secret), nil
	})
}
