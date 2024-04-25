package main

import (
	"time"
)

type MainTest struct {
	ID        int64  `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type DeleteActorReq struct {
	ID        int64  `json:"id"`
	FirstName string `json:"-"`
	LastName  string `json:"-"`
}

type UpdateActorReq struct {
	ID        int64  `json:"id"`
	FirstName string `json:"-"`
	LastName  string `json:"-"`
	Sex       string `json:"-"`
	// DateOfBirth ??? `json:"dateOfBirth"`
	StarringIn []int `json:"contents"`
}

type CreateActorReq struct {
	FirstName  string `json:"-"`
	LastName   string `json:"-"`
	Sex        string `json:"-"`
	StarringIn []int  `json:"starringIn"`
	//DateOfBirth time.Time `json:"dateOfBirth"` dont provide this yet
}

type Actor struct {
	ID                int64     `json:"id"`
	FirstName         string    `json:"-"`
	LastName          string    `json:"-"`
	Sex               string    `json:"-"`
	DateOfBirth       time.Time `json:"-"` //DateOfBirth fix the DOB or just make it a string
	StarringIn        []int     `json:"contents"`
	StarringInDetails []*Movie  `json:"contentsDetails"`
}

////

type DeleteMovieReq struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	ReleaseDate time.Time `json:"creationDate"`
}

type UpdateMovieReq struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	ReleaseDate time.Time `json:"creationDate"`
	Rating      int       `json:"rating"`
	Starring    []int     `json:"-"`
}

type CreateMovieReq struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	ReleaseDate time.Time `json:"creationDate"`
	Rating      int       `json:"rating"`
	Starring    []int     `json:"-"`
}

type Movie struct { // this is Product
	ID              int64     `json:"id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	ReleaseDate     time.Time `json:"creationDate"`
	Rating          int       `json:"rating"`
	Starring        []int     `json:"-"`
	StarringDetails []*Actor  `json:"-"`
}

type User struct { // well you know what this is
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"-"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type DateFormat struct {
	time.Time
}

// func (dob *DateOfBirth) UnmarshalJSON(b []byte) error {
// 	customLayout := "15-02-2003"

// 	parsedTime, err := time.Parse(`"`+customLayout+`"`, string(b))
// 	if err != nil {
// 		return err
// 	}
// 	dob.Time = parsedTime

// 	return nil
// }

func NewActor(firstName, lastName, sex string, starringIn []int) *Actor {
	return &Actor{
		FirstName:   firstName,
		LastName:    lastName,
		Sex:         sex,
		DateOfBirth: time.Now().UTC(),
		StarringIn:  starringIn,
	}
}

func NewMovie(title, desc string, rating int, starring []int) *Movie {
	return &Movie{
		Title:       title,
		Description: desc,
		ReleaseDate: time.Now().UTC(),
		Rating:      rating,
		Starring:    starring,
	}
}

func NewUser(username string, password string) *User {
	return &User{
		Username: username,
		Password: password,
	}
}

type JWT struct {
	SecretKey string
}
