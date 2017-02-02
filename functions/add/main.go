package main

import (
	"encoding/json"

	"bytes"
	"github.com/apex/go-apex"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"io/ioutil"
)

// Event data JSONing
type Event struct {
	ChannelID   string `json:"channel_id"`
	ChannelName string `json:"channel_name"`
	Command     string `json:"command"`
	ResponseURL string `json:"response_url"`
	TeamDomain  string `json:"team_domain"`
	TeamID      string `json:"team_id"`
	Text        string `json:"text"`
	Token       string `json:"token"`
	UserID      string `json:"user_id"`
	UserName    string `json:"user_name"`
}

// ResponseMessage JSON
type ResponseMessage struct {
	ResponseType string `json:"response_type"`
	Text         string `json:"text"`
}

// Quote structure
type Quote struct {
	Text   string `json:"text"`
	Author string `json:"author"`
}

// QuoteFile structure yay
type QuoteFile struct {
	Quotes []Quote `json:"quotes"`
}

func main() {
	apex.HandleFunc(func(msg json.RawMessage, ctx *apex.Context) (interface{}, error) {
		var event Event

		if err := json.Unmarshal(msg, &event); err != nil {
			return nil, err
		}

		// connect to S3
		sess, err := session.NewSession()
		if err != nil {
			return ResponseMessage{Text: "Unable to add quote"}, err
		}

		svc := s3.New(sess)

		// fetch previous quotes
		params := &s3.GetObjectInput{
			Bucket: aws.String("shitjasonsays.com"),
			Key:    aws.String("quotes.json"),
		}

		resp, err := svc.GetObject(params)
		if err != nil {
			return ResponseMessage{Text: "Unable to add quote"}, err
		}

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return ResponseMessage{Text: "Unable to add quote"}, err
		}

		quotes := QuoteFile{}

		err = json.Unmarshal(body, &quotes)
		if err != nil {
			return ResponseMessage{Text: "Unable to add quote"}, err
		}

		// add and upload new quote
		quotes.Quotes = append(quotes.Quotes, Quote{Text: event.Text, Author: event.UserName})

		newQuotes, err := json.Marshal(quotes)
		if err != nil {
			return ResponseMessage{Text: "Unable to add quote"}, err
		}

		uploadParams := &s3.PutObjectInput{
			Bucket:      aws.String("shitjasonsays.com"), // Required
			Key:         aws.String("quotes.json"),       // Required
			Body:        bytes.NewReader(newQuotes),
			ContentType: aws.String("application/json"),
		}

		_, err = svc.PutObject(uploadParams)
		if err != nil {
			return ResponseMessage{Text: "Unable to add quote"}, err
		}

		return ResponseMessage{Text: "Quote added successfully!", ResponseType: "ephemeral"}, err
	})
}
