import numpy as np

class Evaluator:
    @staticmethod
    def ndcg_at_k(relevances, k):
        dcg = sum((2**rel - 1) / np.log2(i + 2) for i, rel in enumerate(relevances[:k]))
        idcg = sum((2**rel - 1) / np.log2(i + 2) for i, rel in enumerate(sorted(relevances, reverse=True)[:k]))
        return dcg / idcg if idcg > 0 else 0

    @staticmethod
    def evaluate_retrieval(retriever, query_embeddings, ground_truth, k=10):
        ndcg_scores = []
        for query_embedding, relevant_docs in zip(query_embeddings, ground_truth):
            retrieved = retriever.retrieve(query_embedding, k)
            relevances = [1 if chunk in relevant_docs else 0 for chunk, _ in retrieved]
            ndcg_scores.append(Evaluator.ndcg_at_k(relevances, k))
        return np.mean(ndcg_scores)