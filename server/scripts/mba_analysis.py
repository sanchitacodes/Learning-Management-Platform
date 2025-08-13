# import json
# import pandas as pd
# from mlxtend.frequent_patterns import apriori, association_rules
# from mlxtend.preprocessing import TransactionEncoder

# # Step 1: Load transactions from transactions.json
# with open('transactions.json', 'r') as f:
#     transactions = json.load(f)

# # Step 2: Convert transactions to a one-hot encoded DataFrame
# te = TransactionEncoder()
# te_ary = te.fit(transactions).transform(transactions)
# df = pd.DataFrame(te_ary, columns=te.columns_)

# # Step 3: Find frequent itemsets using Apriori
# frequent_itemsets = apriori(df, min_support=0.2, use_colnames=True)

# # Step 4: Generate association rules
# rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.0)

# # Step 5: Print results
# print("\n📦 Frequent Itemsets:")
# print(frequent_itemsets)

# print("\n🔗 Association Rules:")
# print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']])

# # ✅ Step 6: Save the rules to a JSON file
# rules_to_save = rules[['antecedents', 'consequents', 'confidence', 'support', 'lift']]
# rules_to_save['antecedents'] = rules_to_save['antecedents'].apply(lambda x: list(x))
# rules_to_save['consequents'] = rules_to_save['consequents'].apply(lambda x: list(x))

# # Save to JSON
# rules_to_save.to_json("association_rules.json", orient="records", indent=2)
# print("\n✅ Association rules saved to association_rules.json")


# import json
# import pandas as pd
# from mlxtend.frequent_patterns import apriori, association_rules
# from mlxtend.preprocessing import TransactionEncoder

# # Step 1: Load transactions from transactions.json
# with open('transactions.json', 'r') as f:
#     transactions = json.load(f)

# # Step 2: Convert transactions to a one-hot encoded DataFrame
# te = TransactionEncoder()
# te_ary = te.fit(transactions).transform(transactions)
# df = pd.DataFrame(te_ary, columns=te.columns_)

# # Step 3: Find frequent itemsets using Apriori
# frequent_itemsets = apriori(df, min_support=0.18, use_colnames=True)

# # Step 4: Generate association rules if itemsets are found
# if not frequent_itemsets.empty:
#     rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.0)
#     # rules = rules[rules['confidence'] > 0.5]

#     # Step 5: Clean and convert for JSON saving
#     rules_to_save = rules[['antecedents', 'consequents', 'confidence', 'support', 'lift']]
#     rules_to_save['antecedents'] = rules_to_save['antecedents'].apply(list)
#     rules_to_save['consequents'] = rules_to_save['consequents'].apply(list)

#     # Save to JSON
#     rules_to_save.to_json("association_rules.json", orient="records", indent=2)
#     print("\n✅ Association rules saved to association_rules.json")
# else:
#     # No frequent itemsets found — save empty list
#     with open("association_rules.json", "w") as f:
#         json.dump([], f, indent=2)
#     print("\n⚠️ No frequent itemsets found. Empty association_rules.json file created.")


import json
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder

# Step 1: Load transactions from transactions.json
with open('transactions.json', 'r') as f:
    transactions = json.load(f)

# Step 2: One-hot encode the transaction data
te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df = pd.DataFrame(te_ary, columns=te.columns_)

# Step 3: Find frequent itemsets using Apriori algorithm
frequent_itemsets = apriori(df, min_support=0.18, use_colnames=True)

# Step 4: Generate association rules if frequent itemsets are found
if not frequent_itemsets.empty:
    rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.0)
    rules = rules[rules['confidence'] >= 0.5]
    
    # Clean up the rules DataFrame
    rules_to_save = rules[['antecedents', 'consequents', 'confidence', 'support', 'lift']].copy()
    rules_to_save['antecedents'] = rules_to_save['antecedents'].apply(lambda x: list(x))
    rules_to_save['consequents'] = rules_to_save['consequents'].apply(lambda x: list(x))
    
    # Save the rules to a JSON file
    rules_to_save.to_json("association_rules.json", orient="records", indent=2)
    print("\n✅ Association rules saved to association_rules.json")
else:
    # No rules found — create empty file
    with open("association_rules.json", "w") as f:
        json.dump([], f, indent=2)
    print("\n⚠️ No frequent itemsets found. Empty association_rules.json file created.")
