"""
Fleet Fuel Management — Pampanga Edition
Philippine vehicles, Filipino drivers, Pampanga municipalities
"""
from flask import Flask, jsonify, request, send_from_directory
import json, os

app      = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE= os.path.join(BASE_DIR, 'fleet_data.json')

DEFAULT_DATA = {
    "vehicles": [
        {"plate": "2468-PAM", "name": "ISUZU ELF NHR",     "driver": "JUAN DELA CRUZ",      "tripAlert": 300, "maxLiters": 60,  "alertKmL": 7,  "alertCost": 20},
        {"plate": "1357-PAM", "name": "MITSUBISHI CANTER",  "driver": "PEDRO REYES",          "tripAlert": 300, "maxLiters": 70,  "alertKmL": 6,  "alertCost": 22},
        {"plate": "9876-PAM", "name": "TOYOTA HILUX",       "driver": "JOSE SANTOS",          "tripAlert": 250, "maxLiters": 50,  "alertKmL": 9,  "alertCost": 18},
        {"plate": "5544-PAM", "name": "ISUZU D-MAX",        "driver": "MARIO GARCIA",         "tripAlert": 250, "maxLiters": 55,  "alertKmL": 8,  "alertCost": 18},
        {"plate": "3322-PAM", "name": "TOYOTA DYNA",        "driver": "ROBERTO CRUZ",         "tripAlert": 350, "maxLiters": 80,  "alertKmL": 6,  "alertCost": 25},
        {"plate": "7711-PAM", "name": "MITSUBISHI L300 VAN","driver": "ANTONIO MENDOZA",      "tripAlert": 200, "maxLiters": 45,  "alertKmL": 10, "alertCost": 15},
        {"plate": "6600-PAM", "name": "FORD RANGER",        "driver": "CARLOS VILLANUEVA",    "tripAlert": 250, "maxLiters": 50,  "alertKmL": 9,  "alertCost": 17},
        {"plate": "4433-PAM", "name": "ISUZU ELF NKR",      "driver": "FRANCISCO RAMOS",      "tripAlert": 300, "maxLiters": 65,  "alertKmL": 7,  "alertCost": 21},
        {"plate": "8822-PAM", "name": "TOYOTA HI-ACE",      "driver": "EDUARDO TORRES",       "tripAlert": 200, "maxLiters": 70,  "alertKmL": 9,  "alertCost": 16},
        {"plate": "1100-PAM", "name": "HINO 300 TRUCK",     "driver": "MANUEL FLORES",        "tripAlert": 400, "maxLiters": 100, "alertKmL": 5,  "alertCost": 28},
        {"plate": "2233-PAM", "name": "MITSUBISHI FUSO",    "driver": "RICARDO BAUTISTA",     "tripAlert": 400, "maxLiters": 100, "alertKmL": 5,  "alertCost": 28},
        {"plate": "5566-PAM", "name": "TOYOTA LAND CRUISER","driver": "ANDRES MANALO",        "tripAlert": 300, "maxLiters": 87,  "alertKmL": 8,  "alertCost": 20},
        {"plate": "9900-PAM", "name": "ISUZU CROSSWIND",    "driver": "BENJAMIN OCAMPO",      "tripAlert": 200, "maxLiters": 55,  "alertKmL": 9,  "alertCost": 16},
    ],
    "records": [
        {
                "date": "2026-01-05",
                "plate": "4433-PAM",
                "vehicle": "ISUZU ELF NKR",
                "driver": "FRANCISCO RAMOS",
                "start": "SAN FERNANDO",
                "end": "MABALACAT",
                "startMile": 55000,
                "endMile": 55032,
                "distance": 32,
                "gallon": 4.79,
                "cost": 294.25,
                "distGal": 6.681,
                "costMile": 9.1953,
                "docType": "RECEIPT",
                "docNum": "RES-1001",
                "comment": ""
        },
        {
                "date": "2026-01-07",
                "plate": "6600-PAM",
                "vehicle": "FORD RANGER",
                "driver": "CARLOS VILLANUEVA",
                "start": "CLARK",
                "end": "PORAC",
                "startMile": 41000,
                "endMile": 41030,
                "distance": 30,
                "gallon": 3.27,
                "cost": 207.01,
                "distGal": 9.174,
                "costMile": 6.9003,
                "docType": "OTHERS",
                "docNum": "RES-1002",
                "comment": ""
        },
        {
                "date": "2026-01-08",
                "plate": "9876-PAM",
                "vehicle": "TOYOTA HILUX",
                "driver": "JOSE SANTOS",
                "start": "SAN FERNANDO",
                "end": "MAGALANG",
                "startMile": 38000,
                "endMile": 38032,
                "distance": 32,
                "gallon": 3.53,
                "cost": 224.99,
                "distGal": 9.065,
                "costMile": 7.0309,
                "docType": "RECEIPT",
                "docNum": "RES-1003",
                "comment": ""
        },
        {
                "date": "2026-01-09",
                "plate": "1100-PAM",
                "vehicle": "HINO 300 TRUCK",
                "driver": "MANUEL FLORES",
                "start": "LUBAO",
                "end": "SAN FERNANDO",
                "startMile": 88000,
                "endMile": 88034,
                "distance": 34,
                "gallon": 6.01,
                "cost": 371.78,
                "distGal": 5.657,
                "costMile": 10.9347,
                "docType": "INVOICE",
                "docNum": "RES-1004",
                "comment": ""
        },
        {
                "date": "2026-01-12",
                "plate": "9900-PAM",
                "vehicle": "ISUZU CROSSWIND",
                "driver": "BENJAMIN OCAMPO",
                "start": "SAN FERNANDO",
                "end": "MEXICO",
                "startMile": 18000,
                "endMile": 18020,
                "distance": 20,
                "gallon": 2.18,
                "cost": 135.2,
                "distGal": 9.174,
                "costMile": 6.76,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1005",
                "comment": ""
        },
        {
                "date": "2026-01-13",
                "plate": "7711-PAM",
                "vehicle": "MITSUBISHI L300 VAN",
                "driver": "ANTONIO MENDOZA",
                "start": "MAGALANG",
                "end": "SAN FERNANDO",
                "startMile": 33000,
                "endMile": 33030,
                "distance": 30,
                "gallon": 2.98,
                "cost": 189.91,
                "distGal": 10.067,
                "costMile": 6.3303,
                "docType": "OTHERS",
                "docNum": "RES-1006",
                "comment": ""
        },
        {
                "date": "2026-01-25",
                "plate": "5566-PAM",
                "vehicle": "TOYOTA LAND CRUISER",
                "driver": "ANDRES MANALO",
                "start": "CLARK",
                "end": "PORAC",
                "startMile": 52000,
                "endMile": 52028,
                "distance": 28,
                "gallon": 3.34,
                "cost": 207.13,
                "distGal": 8.383,
                "costMile": 7.3975,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1007",
                "comment": ""
        },
        {
                "date": "2026-01-28",
                "plate": "8822-PAM",
                "vehicle": "TOYOTA HI-ACE",
                "driver": "EDUARDO TORRES",
                "start": "OLONGAPO",
                "end": "ANGELES",
                "startMile": 27000,
                "endMile": 27087,
                "distance": 87,
                "gallon": 9.07,
                "cost": 580.0,
                "distGal": 9.592,
                "costMile": 6.6667,
                "docType": "INVOICE",
                "docNum": "RES-1008",
                "comment": ""
        },
        {
                "date": "2026-02-05",
                "plate": "8822-PAM",
                "vehicle": "TOYOTA HI-ACE",
                "driver": "EDUARDO TORRES",
                "start": "GUAGUA",
                "end": "LUBAO",
                "startMile": 27087,
                "endMile": 27107,
                "distance": 20,
                "gallon": 2.17,
                "cost": 134.37,
                "distGal": 9.217,
                "costMile": 6.7185,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1009",
                "comment": ""
        },
        {
                "date": "2026-02-08",
                "plate": "9876-PAM",
                "vehicle": "TOYOTA HILUX",
                "driver": "JOSE SANTOS",
                "start": "APALIT",
                "end": "MACABEBE",
                "startMile": 38032,
                "endMile": 38051,
                "distance": 19,
                "gallon": 2.08,
                "cost": 130.91,
                "distGal": 9.135,
                "costMile": 6.89,
                "docType": "INVOICE",
                "docNum": "RES-1010",
                "comment": ""
        },
        {
                "date": "2026-02-09",
                "plate": "7711-PAM",
                "vehicle": "MITSUBISHI L300 VAN",
                "driver": "ANTONIO MENDOZA",
                "start": "CLARK",
                "end": "PORAC",
                "startMile": 33030,
                "endMile": 33068,
                "distance": 38,
                "gallon": 3.88,
                "cost": 241.91,
                "distGal": 9.794,
                "costMile": 6.3661,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1011",
                "comment": ""
        },
        {
                "date": "2026-02-10",
                "plate": "1100-PAM",
                "vehicle": "HINO 300 TRUCK",
                "driver": "MANUEL FLORES",
                "start": "BACOLOR",
                "end": "SAN FERNANDO",
                "startMile": 88034,
                "endMile": 88056,
                "distance": 22,
                "gallon": 3.89,
                "cost": 238.76,
                "distGal": 5.656,
                "costMile": 10.8527,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1012",
                "comment": ""
        },
        {
                "date": "2026-02-11",
                "plate": "2233-PAM",
                "vehicle": "MITSUBISHI FUSO",
                "driver": "RICARDO BAUTISTA",
                "start": "OLONGAPO",
                "end": "ANGELES",
                "startMile": 95000,
                "endMile": 95077,
                "distance": 77,
                "gallon": 14.57,
                "cost": 883.36,
                "distGal": 5.285,
                "costMile": 11.4722,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1013",
                "comment": ""
        },
        {
                "date": "2026-02-14",
                "plate": "4433-PAM",
                "vehicle": "ISUZU ELF NKR",
                "driver": "FRANCISCO RAMOS",
                "start": "ANGELES",
                "end": "CLARK",
                "startMile": 55032,
                "endMile": 55043,
                "distance": 11,
                "gallon": 1.65,
                "cost": 105.85,
                "distGal": 6.667,
                "costMile": 9.6227,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1014",
                "comment": ""
        },
        {
                "date": "2026-02-20",
                "plate": "6600-PAM",
                "vehicle": "FORD RANGER",
                "driver": "CARLOS VILLANUEVA",
                "start": "SAN FERNANDO",
                "end": "MEXICO",
                "startMile": 41030,
                "endMile": 41055,
                "distance": 25,
                "gallon": 2.78,
                "cost": 178.03,
                "distGal": 8.993,
                "costMile": 7.1212,
                "docType": "OTHERS",
                "docNum": "RES-1015",
                "comment": ""
        },
        {
                "date": "2026-02-24",
                "plate": "9900-PAM",
                "vehicle": "ISUZU CROSSWIND",
                "driver": "BENJAMIN OCAMPO",
                "start": "SAN FERNANDO",
                "end": "LUBAO",
                "startMile": 18020,
                "endMile": 18056,
                "distance": 36,
                "gallon": 3.91,
                "cost": 248.21,
                "distGal": 9.207,
                "costMile": 6.8947,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1016",
                "comment": ""
        },
        {
                "date": "2026-03-04",
                "plate": "4433-PAM",
                "vehicle": "ISUZU ELF NKR",
                "driver": "FRANCISCO RAMOS",
                "start": "MAGALANG",
                "end": "SAN FERNANDO",
                "startMile": 55043,
                "endMile": 55069,
                "distance": 26,
                "gallon": 3.87,
                "cost": 236.61,
                "distGal": 6.718,
                "costMile": 9.1004,
                "docType": "OTHERS",
                "docNum": "RES-1017",
                "comment": ""
        },
        {
                "date": "2026-03-07",
                "plate": "9876-PAM",
                "vehicle": "TOYOTA HILUX",
                "driver": "JOSE SANTOS",
                "start": "FLORIDABLANCA",
                "end": "SAN FERNANDO",
                "startMile": 38051,
                "endMile": 38094,
                "distance": 43,
                "gallon": 4.83,
                "cost": 303.73,
                "distGal": 8.903,
                "costMile": 7.0635,
                "docType": "OTHERS",
                "docNum": "RES-1018",
                "comment": ""
        },
        {
                "date": "2026-03-09",
                "plate": "2468-PAM",
                "vehicle": "ISUZU ELF NHR",
                "driver": "JUAN DELA CRUZ",
                "start": "CLARK",
                "end": "MABALACAT",
                "startMile": 45000,
                "endMile": 45013,
                "distance": 13,
                "gallon": 1.76,
                "cost": 112.54,
                "distGal": 7.386,
                "costMile": 8.6569,
                "docType": "RECEIPT",
                "docNum": "RES-1019",
                "comment": ""
        },
        {
                "date": "2026-03-13",
                "plate": "5544-PAM",
                "vehicle": "ISUZU D-MAX",
                "driver": "MARIO GARCIA",
                "start": "GUAGUA",
                "end": "MACABEBE",
                "startMile": 29000,
                "endMile": 29023,
                "distance": 23,
                "gallon": 2.81,
                "cost": 179.95,
                "distGal": 8.185,
                "costMile": 7.8239,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1020",
                "comment": ""
        },
        {
                "date": "2026-03-14",
                "plate": "3322-PAM",
                "vehicle": "TOYOTA DYNA",
                "driver": "ROBERTO CRUZ",
                "start": "LUBAO",
                "end": "SAN FERNANDO",
                "startMile": 71000,
                "endMile": 71042,
                "distance": 42,
                "gallon": 7.15,
                "cost": 440.97,
                "distGal": 5.874,
                "costMile": 10.4993,
                "docType": "INVOICE",
                "docNum": "RES-1021",
                "comment": ""
        },
        {
                "date": "2026-03-17",
                "plate": "8822-PAM",
                "vehicle": "TOYOTA HI-ACE",
                "driver": "EDUARDO TORRES",
                "start": "ANGELES",
                "end": "OLONGAPO",
                "startMile": 27107,
                "endMile": 27184,
                "distance": 77,
                "gallon": 7.81,
                "cost": 499.87,
                "distGal": 9.859,
                "costMile": 6.4918,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1022",
                "comment": ""
        },
        {
                "date": "2026-03-18",
                "plate": "1357-PAM",
                "vehicle": "MITSUBISHI CANTER",
                "driver": "PEDRO REYES",
                "start": "CLARK",
                "end": "MABALACAT",
                "startMile": 62000,
                "endMile": 62011,
                "distance": 11,
                "gallon": 1.69,
                "cost": 102.96,
                "distGal": 6.509,
                "costMile": 9.36,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1023",
                "comment": ""
        },
        {
                "date": "2026-03-24",
                "plate": "7711-PAM",
                "vehicle": "MITSUBISHI L300 VAN",
                "driver": "ANTONIO MENDOZA",
                "start": "OLONGAPO",
                "end": "ANGELES",
                "startMile": 33068,
                "endMile": 33155,
                "distance": 87,
                "gallon": 8.69,
                "cost": 532.66,
                "distGal": 10.012,
                "costMile": 6.1225,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1024",
                "comment": ""
        },
        {
                "date": "2026-04-03",
                "plate": "6600-PAM",
                "vehicle": "FORD RANGER",
                "driver": "CARLOS VILLANUEVA",
                "start": "SAN FERNANDO",
                "end": "MABALACAT",
                "startMile": 41055,
                "endMile": 41090,
                "distance": 35,
                "gallon": 3.76,
                "cost": 241.72,
                "distGal": 9.309,
                "costMile": 6.9063,
                "docType": "RECEIPT",
                "docNum": "RES-1025",
                "comment": ""
        },
        {
                "date": "2026-04-04",
                "plate": "3322-PAM",
                "vehicle": "TOYOTA DYNA",
                "driver": "ROBERTO CRUZ",
                "start": "APALIT",
                "end": "SAN FERNANDO",
                "startMile": 71042,
                "endMile": 71068,
                "distance": 26,
                "gallon": 4.16,
                "cost": 267.95,
                "distGal": 6.25,
                "costMile": 10.3058,
                "docType": "INVOICE",
                "docNum": "RES-1026",
                "comment": ""
        },
        {
                "date": "2026-04-09",
                "plate": "1357-PAM",
                "vehicle": "MITSUBISHI CANTER",
                "driver": "PEDRO REYES",
                "start": "SAN FERNANDO",
                "end": "LUBAO",
                "startMile": 62011,
                "endMile": 62053,
                "distance": 42,
                "gallon": 6.48,
                "cost": 406.29,
                "distGal": 6.481,
                "costMile": 9.6736,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1027",
                "comment": ""
        },
        {
                "date": "2026-04-10",
                "plate": "5566-PAM",
                "vehicle": "TOYOTA LAND CRUISER",
                "driver": "ANDRES MANALO",
                "start": "CLARK",
                "end": "MABALACAT",
                "startMile": 52028,
                "endMile": 52046,
                "distance": 18,
                "gallon": 2.27,
                "cost": 139.26,
                "distGal": 7.93,
                "costMile": 7.7367,
                "docType": "INVOICE",
                "docNum": "RES-1028",
                "comment": ""
        },
        {
                "date": "2026-04-12",
                "plate": "4433-PAM",
                "vehicle": "ISUZU ELF NKR",
                "driver": "FRANCISCO RAMOS",
                "start": "APALIT",
                "end": "MACABEBE",
                "startMile": 55069,
                "endMile": 55082,
                "distance": 13,
                "gallon": 1.88,
                "cost": 118.79,
                "distGal": 6.915,
                "costMile": 9.1377,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1029",
                "comment": ""
        },
        {
                "date": "2026-04-17",
                "plate": "1100-PAM",
                "vehicle": "HINO 300 TRUCK",
                "driver": "MANUEL FLORES",
                "start": "ANGELES",
                "end": "OLONGAPO",
                "startMile": 88056,
                "endMile": 88141,
                "distance": 85,
                "gallon": 15.56,
                "cost": 956.81,
                "distGal": 5.463,
                "costMile": 11.2566,
                "docType": "RECEIPT",
                "docNum": "RES-1030",
                "comment": ""
        },
        {
                "date": "2026-04-18",
                "plate": "5544-PAM",
                "vehicle": "ISUZU D-MAX",
                "driver": "MARIO GARCIA",
                "start": "ANGELES",
                "end": "MABALACAT",
                "startMile": 29023,
                "endMile": 29035,
                "distance": 12,
                "gallon": 1.4,
                "cost": 85.99,
                "distGal": 8.571,
                "costMile": 7.1658,
                "docType": "INVOICE",
                "docNum": "RES-1031",
                "comment": ""
        },
        {
                "date": "2026-04-27",
                "plate": "7711-PAM",
                "vehicle": "MITSUBISHI L300 VAN",
                "driver": "ANTONIO MENDOZA",
                "start": "SAN FERNANDO",
                "end": "ANGELES",
                "startMile": 33155,
                "endMile": 33178,
                "distance": 23,
                "gallon": 2.26,
                "cost": 137.26,
                "distGal": 10.177,
                "costMile": 5.9678,
                "docType": "RECEIPT",
                "docNum": "RES-1032",
                "comment": ""
        },
        {
                "date": "2026-05-07",
                "plate": "9900-PAM",
                "vehicle": "ISUZU CROSSWIND",
                "driver": "BENJAMIN OCAMPO",
                "start": "SAN FERNANDO",
                "end": "MAGALANG",
                "startMile": 18056,
                "endMile": 18088,
                "distance": 32,
                "gallon": 3.28,
                "cost": 200.94,
                "distGal": 9.756,
                "costMile": 6.2794,
                "docType": "RECEIPT",
                "docNum": "RES-1033",
                "comment": ""
        },
        {
                "date": "2026-05-09",
                "plate": "6600-PAM",
                "vehicle": "FORD RANGER",
                "driver": "CARLOS VILLANUEVA",
                "start": "GUAGUA",
                "end": "MACABEBE",
                "startMile": 41090,
                "endMile": 41108,
                "distance": 18,
                "gallon": 2.03,
                "cost": 126.15,
                "distGal": 8.867,
                "costMile": 7.0083,
                "docType": "RECEIPT",
                "docNum": "RES-1034",
                "comment": ""
        },
        {
                "date": "2026-05-12",
                "plate": "9876-PAM",
                "vehicle": "TOYOTA HILUX",
                "driver": "JOSE SANTOS",
                "start": "GUAGUA",
                "end": "MACABEBE",
                "startMile": 38094,
                "endMile": 38116,
                "distance": 22,
                "gallon": 2.34,
                "cost": 142.49,
                "distGal": 9.402,
                "costMile": 6.4768,
                "docType": "OTHERS",
                "docNum": "RES-1035",
                "comment": ""
        },
        {
                "date": "2026-05-16",
                "plate": "4433-PAM",
                "vehicle": "ISUZU ELF NKR",
                "driver": "FRANCISCO RAMOS",
                "start": "APALIT",
                "end": "SAN FERNANDO",
                "startMile": 55082,
                "endMile": 55106,
                "distance": 24,
                "gallon": 3.31,
                "cost": 201.7,
                "distGal": 7.251,
                "costMile": 8.4042,
                "docType": "INVOICE",
                "docNum": "RES-1036",
                "comment": ""
        },
        {
                "date": "2026-05-18",
                "plate": "2233-PAM",
                "vehicle": "MITSUBISHI FUSO",
                "driver": "RICARDO BAUTISTA",
                "start": "SAN FERNANDO",
                "end": "MEXICO",
                "startMile": 95077,
                "endMile": 95100,
                "distance": 23,
                "gallon": 4.21,
                "cost": 261.81,
                "distGal": 5.463,
                "costMile": 11.383,
                "docType": "DELIVERY RECEIPT",
                "docNum": "RES-1037",
                "comment": ""
        },
        {
                "date": "2026-05-20",
                "plate": "1100-PAM",
                "vehicle": "HINO 300 TRUCK",
                "driver": "MANUEL FLORES",
                "start": "ANGELES",
                "end": "OLONGAPO",
                "startMile": 88141,
                "endMile": 88221,
                "distance": 80,
                "gallon": 13.79,
                "cost": 838.45,
                "distGal": 5.801,
                "costMile": 10.4806,
                "docType": "RECEIPT",
                "docNum": "RES-1038",
                "comment": ""
        },
        {
                "date": "2026-05-24",
                "plate": "5566-PAM",
                "vehicle": "TOYOTA LAND CRUISER",
                "driver": "ANDRES MANALO",
                "start": "SAN FERNANDO",
                "end": "MABALACAT",
                "startMile": 52046,
                "endMile": 52088,
                "distance": 42,
                "gallon": 5.0,
                "cost": 319.22,
                "distGal": 8.4,
                "costMile": 7.6005,
                "docType": "RECEIPT",
                "docNum": "RES-1039",
                "comment": ""
        },
        {
                "date": "2026-05-25",
                "plate": "3322-PAM",
                "vehicle": "TOYOTA DYNA",
                "driver": "ROBERTO CRUZ",
                "start": "BACOLOR",
                "end": "SAN FERNANDO",
                "startMile": 71068,
                "endMile": 71083,
                "distance": 15,
                "gallon": 2.62,
                "cost": 163.6,
                "distGal": 5.725,
                "costMile": 10.9067,
                "docType": "INVOICE",
                "docNum": "RES-1040",
                "comment": ""
        }
],
    "sites": [
        "SAN FERNANDO", "ANGELES", "MABALACAT", "CLARK",
        "PORAC", "FLORIDABLANCA", "GUAGUA", "LUBAO",
        "APALIT", "MACABEBE", "MEXICO", "CANDABA",
        "ARAYAT", "MAGALANG", "BACOLOR", "STO. TOMAS",
        "SANTA ANA", "SAN LUIS", "MASANTOL", "SASMUAN",
        "OLONGAPO", "TARLAC", "MANILA", "QUEZON CITY"
    ],
    "docTypes": ["RECEIPT", "INVOICE", "DELIVERY RECEIPT", "OTHERS"]
}

def read_data():
    if not os.path.exists(DATA_FILE):
        write_data(DEFAULT_DATA)
        return DEFAULT_DATA
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route('/')
def serve_index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(BASE_DIR, filename)

@app.route('/api/data', methods=['GET'])
def get_all_data():
    return jsonify(read_data())

@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    return jsonify(read_data()['vehicles'])

@app.route('/api/vehicles', methods=['POST'])
def save_vehicles():
    data = read_data()
    data['vehicles'] = request.json
    write_data(data)
    return jsonify({"status": "ok"})

@app.route('/api/records', methods=['GET'])
def get_records():
    return jsonify(read_data()['records'])

@app.route('/api/records', methods=['POST'])
def save_records():
    data = read_data()
    data['records'] = request.json
    write_data(data)
    return jsonify({"status": "ok"})

@app.route('/api/sites', methods=['GET'])
def get_sites():
    return jsonify(read_data()['sites'])

@app.route('/api/sites', methods=['POST'])
def save_sites():
    data = read_data()
    data['sites'] = request.json
    write_data(data)
    return jsonify({"status": "ok"})

@app.route('/api/doctypes', methods=['GET'])
def get_doctypes():
    return jsonify(read_data()['docTypes'])

@app.route('/api/doctypes', methods=['POST'])
def save_doctypes():
    data = read_data()
    data['docTypes'] = request.json
    write_data(data)
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    print("=" * 50)
    print("  Fleet Fuel Management — Pampanga")
    print("=" * 50)
    print(f"  Data : {DATA_FILE}")
    print(f"  URL  : http://localhost:5000")
    print("=" * 50)
    print("  CTRL+C para itigil ang server.")
    print("=" * 50)
    app.run(debug=False, port=5000)
