import requests

api_key = "fazaurreezsoxxnjjbrbqbpihnynyw"
url = 'https://beta-api.uspto.gov/api/v1/patent/applications/search'
headers = {
    'x-api-key': api_key
}
query = {
    "q": "*",
    "rangeFilters": [
        {
            "field": "applicationMetaData.filingDate",
            "valueFrom": "2024-02-17",
            "valueTo": "2024-08-17"
        }
    ],
    "pagination": {
        "offset": 0,
        "limit": 25
    },
    "sort": [
        {
            "field": "applicationMetaData.filingDate",
            "order": "Desc"
        }
    ]
}

response = requests.post(url, headers=headers, json=query)

if response.status_code == 200:
    data = response.json()
    # Process the data here
    print(data)
else:
    print(f"Request failed with status code {response.status_code}")
    print(response.text)
