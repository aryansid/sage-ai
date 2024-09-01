import json
from datasets import load_dataset

def load_beir_dataset(dataset_name):
    dataset = load_dataset(f"BeIR/{dataset_name}")
    
    corpus = {doc['_id']: doc['text'] for doc in dataset['corpus']}
    queries = {q['_id']: q['text'] for q in dataset['queries']}
    qrels = {}
    for item in dataset['qrels']:
        if item['query'] not in qrels:
            qrels[item['query']] = []
        qrels[item['query']].append(item['corpus'])
    
    return {'corpus': corpus, 'queries': queries, 'qrels': qrels}

def save_results(file_path, results):
    with open(file_path, 'w') as f:
        json.dump(results, f, indent=2)