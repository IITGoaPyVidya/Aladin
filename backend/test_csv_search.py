"""Quick test of CSV search logic"""
import csv

# Read CSV
with open('data/Ticker_List_NSE_India.csv', 'r') as f:
    reader = csv.DictReader(f)
    data = list(reader)

print(f"Total stocks in CSV: {len(data)}")

# Test search for "tata"
query = "tata"
matches = [r for r in data if query.lower() in r['NAME OF COMPANY'].lower() or query.lower() in r['SYMBOL'].lower()]

print(f"\nSearch results for '{query}': {len(matches)} matches")
for i, match in enumerate(matches[:10], 1):
    print(f"{i}. {match['SYMBOL']}: {match['NAME OF COMPANY']}")
