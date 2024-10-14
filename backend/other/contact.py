import csv
import requests
import time

APOLLO_API_KEY = "JVdGnjbljTf0BflzjstnWA"
APOLLO_BULK_MATCH_URL = "https://api.apollo.io/api/v1/people/bulk_match"

# Set this to the number of batches you want to process
BATCHES_TO_PROCESS = 4

def bulk_match_people(people_data):
    print(f"Sending batch of {len(people_data)} people to Apollo API...")
    headers = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": APOLLO_API_KEY
    }
    payload = {
        "api_key": APOLLO_API_KEY,
        "reveal_personal_emails": False,
        "reveal_phone_number": False,
        "details": people_data
    }
    response = requests.post(APOLLO_BULK_MATCH_URL, json=payload, headers=headers)
    if response.status_code == 200:
        print("Successfully received response from Apollo API")
        return response.json().get("matches", [])
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return []

def process_lawyer_contacts():
    print("Starting to process lawyer contacts...")
    enriched_data = [["Name", "Business Name", "Street Address", "Email"]]  # New headers
    people_batch = []
    batch_count = 0
    
    print("Opening LawyerContacts.txt file...")
    with open("LawyerContacts.txt", "r", newline='') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)  # Skip the original header row
        print("Skipped header row, starting to process data rows...")
        
        for row_index, row in enumerate(csv_reader, start=1):
            person = {
                "first_name": row[1],
                "last_name": row[0],
                "organization_name": row[4],
                "city": row[8],
                "state": row[9],
                "country": row[10]
            }
            people_batch.append(person)
            print(f"Added person {row_index} to batch: {person['first_name']} {person['last_name']}")
            
            if len(people_batch) == 10:
                batch_count += 1
                print(f"Processing batch {batch_count} of {BATCHES_TO_PROCESS}")
                enriched_people = bulk_match_people(people_batch)
                for original, enriched in zip(people_batch, enriched_people):
                    name = f"{original['first_name']} {original['last_name']}"
                    business_name = original['organization_name']
                    street_address = row[6]  # Assuming street address is in column 7
                    if enriched:
                        email = enriched.get("email", "")
                        if email:
                            print(f"Processed: {name} - Email: {email}")
                        else:
                            print(f"Processed: {name} - WARNING: NO EMAIL FOUND")
                    else:
                        email = ""
                        print(f"WARNING: NO ENRICHED DATA FOUND FOR: {name}")
                    enriched_data.append([name, business_name, street_address, email])
                
                if batch_count >= BATCHES_TO_PROCESS:
                    print(f"Processed {BATCHES_TO_PROCESS} batches, stopping as requested")
                    break
                
                people_batch = []
                print("Resetting batch and waiting for 1 second...")
                time.sleep(1)  # Respect rate limits
    
    print("Finished processing contacts")
    print(f"Writing {len(enriched_data) - 1} enriched contacts to EnrichedLawyerContacts.csv...")
    # Write simplified enriched data to a new CSV file
    with open("EnrichedLawyerContacts.csv", "w", newline='') as file:
        csv_writer = csv.writer(file)
        csv_writer.writerows(enriched_data)
    print("Finished writing to CSV file")

if __name__ == "__main__":
    print("Script started")
    process_lawyer_contacts()
    print("Script completed")
