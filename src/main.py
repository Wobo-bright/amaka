import argparse
from bot_logic import ask_bot_offline, prepare_resources


def interactive_loop(df, model, index):
    while True:
        try:
            query = input("Ask a question (or 'exit'): ")
        except (EOFError, KeyboardInterrupt):
            print("\nExiting.")
            break

        if query is None:
            break

        query = query.strip()
        if query.lower() == "exit":
            break
        if not query:
            print("Please enter a question or type 'exit' to quit.")
            continue

        answer = ask_bot_offline(query, df, model, index)
        print(f"Answer:\n{answer}\n")


def main():
    parser = argparse.ArgumentParser(description="Inventory RAG bot")
    parser.add_argument("--query", help="Run a single query in non-interactive mode")
    args = parser.parse_args()

    df, model, index = prepare_resources()

    if args.query:
        answer = ask_bot_offline(args.query, df, model, index)
        print(f"Answer:\n{answer}\n")
        return

    interactive_loop(df, model, index)


if __name__ == "__main__":
    main()
