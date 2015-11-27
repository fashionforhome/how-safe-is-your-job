package main

import (
	"fmt"
	"net/http"
	"github.com/gorilla/mux"
	"encoding/json"
	"io/ioutil"
	"strconv"
)

type Saying struct {
	LowerBound uint64
	UpperBound uint64
	Value string
}

type Sayings struct {
	Mapping []Saying
}

func SayingsHandler(w http.ResponseWriter, r *http.Request) {
	name := mux.Vars(r)["name"]
	value, _ := strconv.ParseUint(mux.Vars(r)["value"], 10, 0)

	file := fmt.Sprintf("./config/maps/%v.json", name)
	content, _ := ioutil.ReadFile(file)

	var sayings Sayings
	json.Unmarshal([]byte(content), &sayings)

	var result string
	for _, saying := range sayings.Mapping {
		if (saying.LowerBound == 0 && value < saying.UpperBound) {
			result = saying.Value
		}

		if (saying.UpperBound == 0 && saying.LowerBound <= value) {
			result = saying.Value
		}

		if (saying.LowerBound <= value && value < saying.UpperBound) {
			result = saying.Value
		}
	}

	jsonResult := map[string]interface{} {
		"result": result,
	}

	x, _ := json.Marshal(jsonResult)
	fmt.Fprintln(w, string(x))
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/sayings/{name}/value/{value}", SayingsHandler)
	http.ListenAndServe(":8080", router)
}

