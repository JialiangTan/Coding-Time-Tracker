from difflib import SequenceMatcher
from logging import root
import pycode_similar
import numpy
import ast
import os
import sys
import codegen

f1 = open("file1.py", "r").read()
f2 = open("file2.py", "r").read()
# print(f1.read())
# m = SequenceMatcher(None, f1, f2)
# print(m.ratio())


substring = "if"
count1 = f1.count(substring)
count2 = f2.count(substring)
# print(count1, count2)
# os.system("/home/jtan/.local/bin/pycode_similar file1.py file2.py")
r = pycode_similar.detect([f1, f2], diff_method=pycode_similar.UnifiedDiff, keep_prints=True, module_level=False)

t = r[0][1]
# print(r)
# print(t)

str = f2
str2 = str.splitlines()

# print(root_node)
# print(str2)

# print(ast.dump(root_node))
tree = ast.parse(str)
# expr = tree.body[0]
root = tree.body[0]
ast.NodeVisitor.visit(root)


# print(ast.dump(tree))

# n = ast.FunctionDef(str)
# # print(ast.dump(n))
# print(codegen.to_source(expr))

