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
import tabula
import numpy as np
import glob


def get_dc_airports():
    url = "https://www.tsa.gov/foia/readingroom"
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')
    item = soup.find_all('td', attrs={'class': 'views-align-left'})
    base = "https://www.tsa.gov"
    results = []
    for chunk in item:
        # print(chunk)
        try:
            a_tag = chunk.find("a")
            url = a_tag.get("href")
            if "throughput" in url:
                new_url = base + url
                results.append(new_url)
        except:
            continue
    names_list = []
    for raw_name in results:
        name = raw_name.partition('throughput-')
        name = name[2].partition('.pdf')
        names_list.append(name[0])
    counter = 0

    for name in names_list:
        name_check = name + ".pdf"
#         print(name)
        if name_check not in os.listdir("dc-data/pdfs"):
            print('scraping data')
            link = f"https://www.tsa.gov/sites/default/files/foia-readingroom/tsa-throughput-{name}.pdf"
            g = requests.get(link, stream=True)
            with open(f'dc-data/pdfs/{name}.pdf', 'wb') as sav:
                for chunk in g.iter_content(chunk_size=1000000):
                    sav.write(chunk)
    count = 0
    for file in os.listdir("dc-data/pdfs/"):
        if file.endswith(".pdf"):
            file_check = file + ".csv"
            if file_check not in os.listdir("dc-data/csvs/"):
                print('converting')
                count = count + 1
                print("converting: " + str(count))
                tabula.convert_into(
                    f'dc-data/pdfs/{file}', f'dc-data/csvs/{file}.csv', output_format="csv", pages='all')
            else:
                print('no need for conversion')

    path = os.getcwd()
    csv_files = glob.glob(os.path.join("dc-data/csvs", "*.csv"))
    master = pd.DataFrame()
    for f in csv_files:
        # read the csv file
        df = pd.read_csv(f)
        df["date"] = f
        master = pd.concat([master, df])

    master  # .to_csv("dc-data/final/airports.csv")

    # analysis
    data = master.iloc[1:, :]
    data.columns = data.columns.str.lower().str.strip()
    data = data.fillna(method='ffill')
    data.rename(columns={data.columns[7]: "range"}, inplace=True)
    data.rename(columns={data.columns[6]: "throughput"}, inplace=True)
    data.rename(columns={data.columns[5]: "unnamed"}, inplace=True)
    data.rename(columns={data.columns[4]: "gate"}, inplace=True)
    data.rename(columns={data.columns[3]: "state"}, inplace=True)
    data.rename(columns={data.columns[2]: "city"}, inplace=True)
    data.rename(columns={data.columns[1]: "airport"}, inplace=True)
    data.rename(columns={data.columns[0]: "time"}, inplace=True)
    data = data[["airport", "city", "state", "throughput", "range"]]
    # data['throughput'] = data['throughput'].str.replace('(Unadjusted)', '').astype(float)
    data['throughput'] = pd.to_numeric(data['throughput'], errors='coerce')
    data = data.dropna(subset=['throughput'])
    data['throughput'] = data['throughput'].astype('int')
#     data
    airports = data[(data["airport"] == "IAD") | (
        data["airport"] == "DCA") | (data["airport"] == "BWI")]
    (airports).to_csv('temp.csv')
    date_list_1 = []
    for index, row in airports.iterrows():
        split_date = row["range"].split("/")
        date_dirty = split_date[2]
#         print(date_dirty)
        date_list_1.append(date_dirty)
    airports["range"] = date_list_1
    date_list_2 = []
    for index, row in airports.iterrows():
        split_date = row["range"].split(".")
        date_dirty = split_date[0]
        date_list_2.append(date_dirty)
#         print(date_list_2)
    airports["range"] = date_list_2
    date_list_start = []
    date_list_end = []
    for index, row in airports.iterrows():
        split_date = row["range"].split("-to-")
        date_start = split_date[0]
        date_end = split_date[1]
        date_list_start.append(date_start)
        date_list_end.append(date_end)
    airports["start"] = date_list_start
    airports["end"] = date_list_end
    airports["end"] = pd.to_datetime(airports["end"])
    # airports["end_formatted"] = airports["end"].dt.strftime('%b. %d')
    airports
    airports["end"] = pd.to_datetime(airports["end"])
    # airports["end_formatted"] = airports["end"].dt.strftime('%b. %d')
    airports
    clean_data = airports.groupby(['airport', 'end'])[
        'throughput'].agg('sum').to_frame().reset_index()
    clean_data
    final = clean_data.pivot(
        index='end', columns='airport', values='throughput').reset_index()
    final["end_formatted"] = pd.to_datetime(final["end"])
    final["end_formatted"] = final["end_formatted"].dt.strftime('%b. %d, %Y')
    final
    final.to_csv('dc-data/final/final.csv')


get_dc_airports()
