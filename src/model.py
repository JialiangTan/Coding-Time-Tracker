import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import datasets, linear_model, metrics
from sklearn.metrics import mean_squared_error
import xlrd
import pickle

np.set_printoptions(threshold=sys.maxsize)

def clean_dataset(df):
    assert isinstance(df, pd.DataFrame), "df needs to be a pd.DataFrame"
    df.dropna(inplace=True)
    indices_to_keep = ~df.isin([np.nan, np.inf, -np.inf]).any(1)
    return df[indices_to_keep].astype(np.float64)

df = pd.read_excel('HW4_processed.xlsx', index_col= None)

# print(df)
# print(np.asfarray(df))
# df = df.iloc[::5, :]
# print(np.asfarray(df))

# remove nan data
df = clean_dataset(df)
 

x_raw = df.iloc[:, [1, 2, 3]]
# print(x_raw)
x_data = np.array(x_raw)
# print(x_data.shape)
# print(x_data)

y_raw = df.iloc[:, [0]]
y_data = np.array(y_raw)
# print(y_data.shape)
# print(y_data)

x_train = x_data[:-20]
y_train = y_data[:-20]
# y_train.shape = (301, 1)

x_test = x_data[-20:]
y_test = y_data[-20:]
# y_test.shape = (20, 1)
# print(y_test.shape)

regr = linear_model.LinearRegression()
# fit the model on training set
regr.fit(x_train, y_train)

# print(x_test[0,:])
# print(x_test.shape)
y_pred = regr.predict(x_test)

mse = mean_squared_error(y_test, y_pred)
print(mse)

# print(x_test)
# print(y_test)
#  [[0.8]
#  [1. ]
#  [0.4]
#  [0.6]
#  [0.8]
#  [1. ]
#  [0.4]
#  [0.6]
#  [0.8]
#  [1. ]
#  [0.2]
#  [0.4]
#  [0.6]
#  [0.8]
#  [1. ]
#  [0.2]
#  [0.4]
#  [0.6]
#  [0.8]
#  [1. ]]
print(y_pred)

# TODO: need to fit y_pred in [0,1]

print(regr.coef_)

input = np.array([[10, 2, 10]])
result = regr.predict(input)
print(result[0][0])

# save the model to disk
filename = 'finalized_model.sav'
pickle.dump(regr, open(filename, 'wb'))


