import numpy as np
import sys
import pickle

# model = pickle.load(open('finalized_model.sav', 'rb'))


# argumentlist = sys.argv

# lineNum = float(argumentlist[1])
# keyNum = float(argumentlist[2])

# input = np.array([[lineNum, 2, keyNum]])
# result = model.predict(input)
# print(result[0][0])

result = 10086

f = open('/home/jtan/vscode-extension/coding-time-tracker/src/print.txt', 'w')
f.write("result = " + str(result))
f.close()




