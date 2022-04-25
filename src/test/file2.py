import numpy
def shipping_rate(weight):
    if weight <=2:
        return 1.50*weight
    elif weight <=6:
        return 3.0+(weight-2)*3
    elif weight <= 10:
        return 4.0*(weight-6)+15
    else:
        return 4.75*(weight-10)+31

