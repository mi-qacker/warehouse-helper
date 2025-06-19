#!/bin/bash

BASE_URL="https://testing.warehouse-helper.ru/api/performance?module=genetic"

# Функция для выполнения запроса
make_request() {
  local min=$1
  local max=$2
  local url="${BASE_URL}&min=${min}&max=${max}"
  local output_file="result_${min}_${max}.csv"
  
  echo "Starting request for range ${min}-${max}, saving to ${output_file}..."
  curl -s "$url" > "$output_file" && echo "Completed range ${min}-${max}" || echo "Failed range ${min}-${max}" &
}

# Выполняем 5 параллельных запросов с шагом 10
make_request 1 5
make_request 6 10
make_request 11 15 
make_request 16 20 
make_request 21 25
make_request 26 30
make_request 31 35
make_request 36 40
make_request 41 45
make_request 46 50

# Ожидаем завершения всех фоновых процессов
wait
echo "All requests completed"