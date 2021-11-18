import requests
from bs4 import BeautifulSoup
from datetime import datetime
from datetime import timedelta
from datetime import date
import csv
import pandas as pd
import time
import json
import fnmatch
import os
import numpy as np
import urllib.request


def get_tsa():
    url = "https://www.tsa.gov/coronavirus/passenger-throughput"
    item = "html"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"}
    # if item == "html":
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.text, 'html.parser')
#     soup
    results = []
    table = soup.find("table", {"class": "views-table"})

    # table
    rows = table.find_all('tr')
    for row in rows[1:]:
        cells = row.find_all('td')
        results.append([cell.text for cell in cells])
    with open('tsa.csv', 'w') as output_file:
        csvfile = csv.writer(output_file)
        csvfile.writerow(['date', '2021-throughput',
                         '2020-throughput', '2019-throughput'])
        csvfile.writerows(results)
    data = pd.read_csv("tsa.csv")
    day_list = []
    month_list = []
    for index, row in data.iterrows():
        split_date = row["date"].split("/")
        month = split_date[0]
        day = split_date[1]
        day_list.append(day)
        month_list.append(month)
    data["day"] = day_list
    data["month"] = month_list
    #     stripped_val = ((row["2021-throughput"]).strip().replace(",",""))
    int_list = []
    for index, row in data.iterrows():
        stripped_val = ((row["2021-throughput"]).strip().replace(",", ""))
        if stripped_val != "":
            int_list.append(int(float(stripped_val)))
        else:
            int_list.append('undef')
    #     print(int_list)
    data["2021-throughput"] = int_list
    data['2019-throughput'] = data['2019-throughput'].str.replace(
        ',', '').astype(float)
    data['2020-throughput'] = data['2020-throughput'].str.replace(
        ',', '').astype(float)
    data['date'] = pd.to_datetime(data['date'])

    data['day'] = data['day'].astype(float)
    data['month'] = data['month'].astype(float)

    for index, row in data.iterrows():
        data["formatted_date"] = data['date'].dt.strftime('%b. %d')
    data = data.sort_values(["month", "day"], ascending=(True, True))
    data
    print('done!')
    data.to_csv("tsa.csv")
    with open(f'./logs/log_record{time.strftime("%Y%m%d-%H%M%S")}.txt', "w") as f:
        f.write(
            f'Successfully national-scrape.py ran on {time.strftime("%Y%m%d-%H%M%S")}')


get_tsa()
