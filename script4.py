import pymongo
import serial
from getpass import getpass


client = pymongo.MongoClient("mongodb+srv://Osma:1234@cluster0.9ph89dx.mongodb.net/")
db = client["Bank"]
collection = db["Users"]

C = "5C009D824407"
D = "55007A09D5F3"
E = "5C009E925505"

PortRF = serial.Serial('/dev/ttyAMA0', 9600)

def authenticate_user(ID):
    username = input("Enter your username: ")
    password = getpass("Enter your password: ")

    user_query = {"username": username, "password": password, "card_no": ID}
    return collection.find_one(user_query)

def perform_deposit(user):
    amount = float(input("Enter the deposit amount: "))
    current_balance = user["balance"] + amount
    collection.update_one({"card_no": user["card_no"]}, {"$set": {"balance": current_balance}})
    print(f"Deposit of {amount} successful. Current balance: {current_balance}")

def perform_withdrawal(user):
    amount = float(input("Enter the withdrawal amount: "))
    if user["balance"] >= amount:
        current_balance = user["balance"] - amount
        collection.update_one({"card_no": user["card_no"]}, {"$set": {"balance": current_balance}})
        print(f"Withdrawal of {amount} successful. Current balance: {current_balance}")
    else:
        print("Insufficient funds for withdrawal.")


while True:
    print("Please insert your card")
    ID = ""
    read_byte = PortRF.read()
    

    if read_byte == b"\x02":
        for i in range(0, 12):
            read_byte = PortRF.read()
            ID += read_byte.decode('utf-8')

        print("Card_no:", ID)
        if ID == C or ID == D or ID == E:
            user = authenticate_user(ID)
            if user:
                print(f"Authentication successful for user: {user['username']}")
                print(f"Balance: {user['balance']}")

                transaction_type = input("Do you want to deposit (D) or withdraw (W) money? Press any other key to exit: ")

                if transaction_type.upper() == 'W':
                    perform_withdrawal(user)

                elif transaction_type.upper() == 'D':
                    perform_deposit(user)

                else:
                    print("Invalid transaction type.")
                    break

            else:
                print("Invalid username or password.")
                break
        else:
            print("Invalid Card.")
            break
