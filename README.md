# Node.js 小工具

## 检查url是否能正常访问

> node index.js analyse -f data/matrixUrls.log -t matrix  
> node index.js analyse -f data/routeUrls.log -t route

## 调用url，获取结果

> node index.js call -f data/matrixUrls.log -t matrix -o matrix.json  
> node index.js call -f data/routeUrls.log -t route -o route.json

## 分析data组的数据，补全数据

> node index.js data -f data/Sample_Rides_For_NokiaHere.csv -o data/Sample_Rides.csv -s data/nokia.csv
