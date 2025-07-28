import csv
from bs4 import BeautifulSoup

def extract_author_data(html_file_path):
    """
    Parses an HTML file to extract author details and saves them to a CSV file.

    Args:
        html_file_path (str): The path to the HTML file to be parsed.
    
    Returns:
        list: A list of dictionaries, where each dictionary represents an author.
    """
    print(f"Reading HTML file from: {html_file_path}")
    
    try:
        with open(html_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: The file '{html_file_path}' was not found.")
        print("Please make sure the HTML file is in the same directory as the script.")
        return []

    soup = BeautifulSoup(content, 'lxml')
    
    # The main container for each person's card is a div with the class 'tmb'
    author_cards = soup.find_all('div', class_='tmb')
    
    if not author_cards:
        print("Could not find any author cards. Check the HTML structure (e.g., 'div' with class 'tmb').")
        return []

    print(f"Found {len(author_cards)} author cards. Processing now...")
    
    extracted_data = []
    
    for card in author_cards:
        # Extract the name from the h3 tag with class 't-entry-title'
        name_tag = card.find('h3', class_='t-entry-title')
        name = name_tag.get_text(strip=True) if name_tag else 'Name not found'
        
        # Extract the institute from the p tag with class 't-entry-meta'
        institute_tag = card.find('p', class_='t-entry-meta')
        institute = institute_tag.find('span').get_text(strip=True) if institute_tag and institute_tag.find('span') else 'Institute not found'
        
        # Extract the profile picture link from the img tag's 'src' attribute
        img_tag = card.find('img')
        image_url = img_tag['src'] if img_tag else 'Image URL not found'
        
        # Extract the author page link. It's in an 'a' tag inside a specific p tag.
        # This is more robust for cases where the link might be missing.
        author_page_link_tag = card.find('p', class_='t-entry-member-social')
        author_page_url = '' # Default to empty string
        if author_page_link_tag and author_page_link_tag.find('a'):
            author_page_url = author_page_link_tag.find('a')['href']
        
        # Some author links are empty strings in the HTML, so we check for that.
        if not author_page_url:
            author_page_url = 'Author page link not found'

        extracted_data.append({
            'name': name,
            'institute': institute,
            'profile_picture_url': image_url,
            'author_page_url': author_page_url
        })
        
    return extracted_data

def save_to_csv(data, csv_file_path):
    """
    Saves a list of dictionaries to a CSV file.
    
    Args:
        data (list): A list of dictionaries to save.
        csv_file_path (str): The path for the output CSV file.
    """
    if not data:
        print("No data to save.")
        return

    # The keys of the first dictionary will be our CSV headers
    fieldnames = data[0].keys()
    
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        writer.writerows(data)
        
    print(f"\nSuccessfully saved {len(data)} records to '{csv_file_path}'")

# --- Main execution part ---
if __name__ == "__main__":
    HTML_FILE = 'test.html'
    CSV_FILE = 'authors_data.csv'
    
    authors = extract_author_data(HTML_FILE)
    
    if authors:
        # Optional: Print the first few results to the console for verification
        print("\n--- First 3 Results ---")
        for author in authors[:3]:
            print(author)
        print("-----------------------\n")
        
        save_to_csv(authors, CSV_FILE)