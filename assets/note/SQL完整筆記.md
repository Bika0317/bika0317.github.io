## 目錄

- [資料型別](#資料型別)
  - [數字型別](#數字型別)
  - [字串型別](#字串型別)
  - [日期時間型別](#日期時間型別)
  - [布林型別](#布林型別)
  - [NULL 值](#null-值)
- [CREATE](#create)
  - [CREATE DATABASE](#create-database)
  - [ALTER DATABASE](#alter-database)
  - [DROP DATABASE](#drop-database)
  - [CREATE TYPE](#create-type自定義資料型態)
  - [CREATE TABLE](#create-table)
  - [多主鍵](#多主鍵)
  - [FOREIGN KEY 外鍵](#foreign-key外鍵)
  - [CHECK 條件限制](#check條件限制)
  - [CHECK 多條件](#check-多條件需要都滿足才可)
  - [CONSTRAINT 自訂限制名稱](#constraint自訂限制名稱)
    - [PRIMARY KEY CONSTRAINT](#primary-key-constraint)
    - [FOREIGN KEY CONSTRAINT](#foreign-key-constraint)
    - [CHECK CONSTRAINT](#check-constraint)
- [ALTER](#alter)
- [SELECT](#select)
  - [計算運算子](#計算運算子)
- [WHERE](#where)
  - [比較運算子](#比較運算子)
  - [AND / OR](#and--or)
  - [IN](#in)
  - [BETWEEN](#between)
  - [LIKE 模糊比對](#like模糊比對)
  - [IS NULL](#is-null)
- [ORDER BY](#order-by)
  - [多欄位排序](#多欄位排序)
- [TOP](#top)
- [DISTINCT](#distinct)
- [聚合函數](#聚合函數)
- [GROUP BY + HAVING](#group-by--having)
  - [WITH ROLLUP 單向小計](#with-rollup單向小計)
  - [WITH CUBE 雙向小計](#with-cube雙向小計)
  - [GROUPING SETS 自訂小計](#grouping-sets自訂小計)
- [JOIN](#join)
  - [INNER JOIN](#inner-join內部合併)
  - [LEFT JOIN](#left-join左外部合併)
  - [RIGHT JOIN](#right-join右外部合併)
  - [FULL JOIN](#full-join完整外部合併)
  - [CROSS JOIN](#cross-join交叉合併)
  - [自我合併 Self Join](#自我合併self-join)
- [UNION / INTERSECT / EXCEPT](#union--intersect--except)
- [子查詢](#子查詢)
  - [FROM 子查詢](#from-子查詢子查詢當暫時資料表)
  - [WHERE 子查詢](#where-子查詢子查詢當條件)
  - [比較運算子子查詢](#比較運算子子查詢)
  - [NOT IN 子查詢](#not-in-子查詢)
  - [IN 子查詢](#in-子查詢)
  - [ALL](#all滿足所有結果)
  - [ANY / SOME](#any--some滿足任一結果)
  - [EXISTS](#exists是否存在資料)
  - [NOT EXISTS](#not-exists是否不存在資料)
- [INSERT](#insert)
- [UPDATE](#update)
- [DELETE](#delete)
- [TRUNCATE](#truncate)
- [MERGE](#merge)
- [VIEW 檢視表](#view檢視表)
  - [常用選項](#常用選項)
  - [WITH CHECK OPTION 對 DML 的影響](#with-check-option-對-dml-的影響)
  - [三種類型](#三種類型)
  - [VIEW 重點整理](#view重點整理)
- [INDEX 索引](#index索引)
  - [基本語法](#基本語法)
  - [自動建立索引](#自動建立索引)
  - [索引類型比較](#索引類型比較)
  - [複合索引與最左前綴法則](#複合索引與最左前綴法則)
  - [INCLUDE 欄位索引](#include-欄位索引)
  - [WITH 常見選項](#with-常見選項)
  - [篩選索引 Filtered Index](#篩選索引filtered-index)
  - [Columnstore Index](#columnstore-index)
  - [計算欄位索引](#計算欄位索引)
    - [ANSI_NULLS](#ansi_nulls)
    - [ANSI_PADDING](#ansi_padding)
    - [ANSI_WARNINGS](#ansi_warnings)
    - [ARITHABORT](#arithabort)
    - [CONCAT_NULL_YIELDS_NULL](#concat_null_yields_null)
    - [QUOTED_IDENTIFIER](#quoted_identifier)
    - [NUMERIC_ROUNDABORT](#numeric_roundabort)
  - [檢視表索引](#檢視表索引)
  - [執行計畫常見名詞](#執行計畫常見名詞)
  - [重點整理](#重點整理)
- [M 路搜尋樹 & B-Tree](#m-路搜尋樹--b-tree)
  - [M 路搜尋樹](#m-路搜尋樹m-way-search-tree)
  - [B-Tree](#b-tree)
- [Transact-SQL](#transact-sql)
  - [GO](#go)
  - [註解](#註解)
  - [PRINT / 輸出變數](#print)
  - [USE](#use)
- [變數](#變數)
  - [宣告變數](#宣告變數)
  - [SET 指定變數值](#set-指定變數值)
  - [SELECT 指定變數值](#select-指定變數值)
  - [變數當 WHERE 條件](#變數當-where-條件)
  - [變數種類](#變數種類)
  - [位元運算子](#位元運算子)
  - [T-SQL 運算子優先順序](#t-sql-運算子優先順序由高到低)
  - [SQL Server 系統函數](#sql-server-系統函數)
- [類型轉換概念](#類型轉換概念)
  - [隱含轉換 / 強迫轉換](#類型轉換種類)
  - [CAST 運算子](#cast-運算子)
  - [CONVERT 函數](#convert-函數)
  - [CAST 與 CONVERT 比較](#cast-與-convert-比較)
- [流程控制結構](#流程控制結構-control-structures)
  - [BEGIN / END 指令區塊](#begin--end-指令區塊)
  - [IF / ELSE 條件控制](#if--else-條件控制)
  - [IF 搭配 COUNT](#if-搭配-count)
  - [DB_ID()](#db_id)
  - [OBJECT_ID()](#object_id)
  - [RETURN](#return)
  - [CASE 多條件函數](#case-多條件函數)
  - [簡單 CASE](#簡單-case-simple-case)
  - [搜尋 CASE](#搜尋-case-searched-case)
  - [WHILE 迴圈](#while-迴圈)
  - [BREAK](#break)
  - [CONTINUE](#continue)
  - [巢狀 WHILE](#巢狀-while)
  - [BREAK 關鍵字跳出迴圈](#break-關鍵字跳出迴圈)
  - [CONTINUE 關鍵字繼續迴圈](#continue-關鍵字繼續迴圈)
  - [GOTO 跳躍至指定標籤](#goto-跳躍至指定標籤)
  - [WAITFOR 暫停執行](#waitfor-暫停執行)
  - [IIF() 函數](#iif-函數)
  - [CHOOSE() 函數](#choose-函數)
- [TRY / CATCH 錯誤處理](#try--catch-錯誤處理)
  - [TRY / CATCH 基本語法](#try--catch-基本語法)
  - [執行流程](#執行流程)
  - [錯誤嚴重性等級 Severity](#錯誤嚴重性等級severity)
  - [錯誤處理函數](#錯誤處理函數)
    - [ERROR_NUMBER()](#error_number)
    - [ERROR_MESSAGE()](#error_message)
    - [ERROR_SEVERITY()](#error_severity)
    - [ERROR_STATE()](#error_state)
    - [ERROR_LINE()](#error_line)
    - [ERROR_PROCEDURE()](#error_procedure)
- [RAISERROR()](#raiserror)
  - [新增自訂錯誤訊息 sp_addmessage](#新增自訂錯誤訊息)
  - [RAISERROR 產生錯誤](#raiserror-產生錯誤)
  - [考試重點](#考試重點)
- [THROW](#throw)
  - [THROW 自訂錯誤範例](#throw-自訂錯誤範例)
  - [THROW 無參數](#throw-無參數)
  - [THROW 重拋例外](#throw-重拋例外)
- [RAISERROR vs THROW](#raiserror-vs-throw)
- [產生 SQL Server 指令碼](#產生-sql-server-指令碼)
- [預存程序 Stored Procedure](#預存程序stored-procedure)
  - [CREATE PROCEDURE 建立預存程序](#create-procedure建立預存程序)
    - [單一參數](#單一參數)
    - [多參數 + IF 條件](#多參數--if-條件)
  - [EXEC 執行預存程序](#exec執行預存程序)
  - [預設值參數 Optional Parameters](#預設值參數optional-parameters)
  - [巢狀呼叫 Nesting](#巢狀呼叫nesting)
  - [預存程序的傳回值](#預存程序的傳回值)
  - [使用 RETURN 關鍵字](#使用-return-關鍵字)
  - [使用 OUTPUT 關鍵字](#使用-output-關鍵字)
  - [修改與刪除預存程序](#修改與刪除預存程序)
  - [系統預存程序](#系統預存程序system-stored-procedures)
- [順序物件 Sequence](#順序物件sequence)
  - [建立順序物件](#建立順序物件)
  - [CREATE SEQUENCE 子句說明](#create-sequence-子句說明)
  - [使用順序物件 NEXT VALUE FOR](#使用順序物件next-value-for)
  - [IDENTITY_INSERT](#identity_insert允許插入識別欄位)
  - [修改順序物件 ALTER SEQUENCE](#修改順序物件alter-sequence)
  - [刪除順序物件 DROP SEQUENCE](#刪除順序物件drop-sequence)

---

## 資料型別型別

| 型別 | 說明 |
|------|------|
| `INT` / `INTEGER` | 整數 |
| `SMALLINT` | 小整數 |
| `BIGINT` | 大整數 |
| `DECIMAL(a, b)` | 精確小數，a 是總位數，b 是小數位數 |
| `DOUBLE` | 雙精度浮點數 |
| `FLOAT` | 浮點數 |

### 字串型別

| 型別           | 說明           |
| ------------ | ------------ |
| `CHAR(n)`    | 固定長度字串，長度為 n |
| `VARCHAR(n)` | 字串（最多 n 個字元） |
| `TEXT`       | 長文字          |

### 日期時間型別

| 型別 | 格式 |
|------|------|
| `DATE` | YYYY-MM-DD |
| `DATETIME` | YYYY-MM-DD HH:MM:SS |
| `TIME` | HH:MM:SS |
| `TIMESTAMP` | YYYY-MM-DD HH:MM:SS，自動記錄時間戳記 |

### 布林型別

儲存真/假值：`TRUE` / `FALSE` 或 `1` / `0`

### NULL 值

`NULL` 代表「沒有值」或「未知」，和空字串 `''` 或數字 `0` 不同。

---

## CREATE

### CREATE DATABASE

```sql
CREATE DATABASE 學校系統;  -- 創立資料庫
```

### ALTER DATABASE

```sql
ALTER DATABASE 學校系統 MODIFY NAME = 校務系統;  -- 修改資料庫名稱
```

### DROP DATABASE

```sql
DROP DATABASE 校務系統;  -- 刪除資料庫（要先取消所有使用中的連線才可刪除）
```

### CREATE TYPE（自定義資料型態）

```sql
CREATE TYPE address FROM VARCHAR(35) NOT NULL;
-- 自行定義型態 address 是文字（35個以內，且不可以是 null）
-- 之後 CREATE 表格就可以直接套用

CREATE TABLE Customer (
    CustomerID       INT,
    CustomerAddress  address  -- 此 address 是上面 CREATE 出來的資料型態
);
```

### CREATE TABLE

```sql
CREATE TABLE 表名 (
    欄位名0  INT IDENTITY(1,1000),           -- 起始值為 1000，自動往後編號
    欄位名1  CHAR(10) NOT NULL PRIMARY KEY,  -- 設立為單一主鍵
    欄位名2  INT DEFAULT 1,                  -- 若無填入值，預設值設定
    欄位名3  DECIMAL(5,1),                   -- 位數最多 5，小數占 1 位，範圍 -9999.9 ~ 9999.9
    欄位名4  CHAR(5) NOT NULL,               -- 不可為空值
    欄位名5  AS (欄位名3 / 欄位名2)           -- 此欄位為運算欄位
);
```

#### 多主鍵

```sql
CREATE TABLE 班級 (
    教授編號  CHAR(4),
    課程編號  CHAR(5),
    學號      CHAR(4),
    PRIMARY KEY (學號, 教授編號, 課程編號)  -- 若有多主鍵這樣寫
);
```

#### FOREIGN KEY（外鍵）

```sql
CREATE TABLE 班級 (
    學號  CHAR(4),
    FOREIGN KEY (學號)
        REFERENCES 學生(學號)  -- 設立外鍵，需先設立表格欄位才可建立外鍵
);
```

#### CHECK（條件限制）

```sql
CREATE TABLE Member (
    Age  INT CHECK (Age >= 18)  -- 限制年齡 >= 18
    -- 語法：欄位名稱 資料型態 CHECK (條件)
);
```

#### CHECK 多條件（需要都滿足才可）

```sql
CHECK (
    (訂單總價 > 0)
    AND
    (付款總額 > 0)
    AND
    (訂單總價 > 付款總額)
)
```

### CONSTRAINT（自訂限制名稱）

> 方便之後修改、刪除、管理

#### PRIMARY KEY CONSTRAINT

```sql
CREATE TABLE 學生 (
    學號  CHAR(4),
    CONSTRAINT PK_學生
        PRIMARY KEY (學號)  -- PK_學生 是主鍵名稱
);

ALTER TABLE 學生
DROP CONSTRAINT PK_學生; --先刪除主鍵

ALTER TABLE 學生
ADD CONSTRAINT PK_學生
PRIMARY KEY (學號); --重新加上去
```

#### FOREIGN KEY CONSTRAINT

```sql
CREATE TABLE 班級 (
    學號  CHAR(4),
    CONSTRAINT FK_班級_學生
        FOREIGN KEY (學號)
        REFERENCES 學生(學號)  -- FK_班級_學生 是外鍵名稱
);
```

#### CHECK CONSTRAINT

```sql
CREATE TABLE Member (
    Age  INT,
    CONSTRAINT CK_Member_Age  -- CK_Member_Age 是 CHECK 名稱
        CHECK (Age >= 18)
);
```

---
## ALTER

```sql
-- 新增欄位
ALTER TABLE 我的訂單
ADD 訂單日期 DATETIME NOT NULL,
    送貨日期 DATETIME;

-- 刪除欄位
ALTER TABLE 我的訂單
DROP COLUMN 送貨日期;

-- 修改欄位
ALTER TABLE 我的訂單
ALTER COLUMN 訂單日期 VARCHAR(20) NOT NULL;
```

> **建立資料庫圖表**：左邊目錄 → 右鍵資料庫圖表 → 新增 → 選取
> 若學校資料庫無法直接建立，先切 sa，再輸入：
> ```sql
> ALTER AUTHORIZATION ON DATABASE::資料庫名 TO sa;
> ```

---

## SELECT

### 基本語法

```sql
SELECT 欄位名稱 AS 別名 FROM 表名;  -- AS 別名只會在查詢看到，不會更改資料庫

SELECT 計算欄位 FROM 表名;
-- 計算欄位範例：欄位1 + 欄位2
-- 若為字串連接：'欄位1' + '欄位2'

SELECT * FROM 表名;         -- 搜尋全部欄位
SELECT 欄位名 FROM 表名;    -- 只搜尋該欄位
```

### 計算運算子

| 符號 | 說明 |
|------|------|
| `+` | 加法 |
| `-` | 減法 |
| `*` | 乘法 |
| `/` | 除法 |
| `%` | 餘數 |

---

## WHERE

```sql
SELECT 欄位名 FROM 表名
WHERE 條件;
```

### 比較運算子

| 符號 | 說明 |
|------|------|
| `=` | 等於 |
| `<>` 或 `!=` | 不等於 |
| `>` | 大於 |
| `<` | 小於 |
| `>=` | 大於等於 |
| `<=` | 小於等於 |

### AND / OR

多條件查詢，使用 `AND` 和 `OR` 組合多個條件。

### IN

```sql
WHERE city IN ('台北', '高雄')
-- 加上 NOT 即可找不符合條件的
```

### BETWEEN

```sql
WHERE salary BETWEEN 30000 AND 50000
-- 加上 NOT 即可找不符合條件的
```

### LIKE（模糊比對）

```sql
WHERE name LIKE '王%'
-- 加上 NOT 即可找不符合條件的
```

| 語法 | 說明 |
|------|------|
| `'A%'` | A 開頭 |
| `'%A'` | A 結尾 |
| `'%A%'` | 包含 A |
| `'_A%'` | 第二個字是 A |
| `'A_'` | 兩個字，A 開頭 |
| `'__A'` | 三個字，A 結尾 |
| `'A__'` | 三個字，A 開頭 |
| `'_A_'` | 三個字，中間是 A |
| `'[ABC]%'` | A 或 B 或 C 開頭 |
| `'[A-C]%'` | A~C 開頭 |
| `'[^A]%'` | 不是 A 開頭 |
| `'%A_B%'` | 包含 A + 任意 1 字 + B |

### IS NULL

```sql
WHERE phone IS NULL
```

---

## ORDER BY

```sql
SELECT 欄位名 FROM 表名
ORDER BY 欄位名 [ASC|DESC];
-- 若多欄位可用 , 分開直接寫
-- 若沒寫 ASC/DESC 預設為 ASC
-- ASC 小到大；DESC 大到小
```

### 多欄位排序

```sql
SELECT * FROM employees
ORDER BY department ASC, salary DESC;
```

---

## TOP

```sql
SELECT TOP 5 * FROM products;            -- 取前 5 筆
SELECT TOP 25 PERCENT * FROM products;  -- 取前 25%

-- WITH TIES：列出並列（需定位於某欄位才可並列）
SELECT TOP 3 WITH TIES *
FROM 課程
ORDER BY 學分;
```

---

## DISTINCT

```sql
SELECT DISTINCT city FROM customers;
-- 查詢此表有哪些城市，重複的只顯示一次
-- 多欄位去除重複：篩選的欄位都一樣才會判定為重複
```

---

## 聚合函數

| 函數           | 說明             |
| ------------ | -------------- |
| `SUM()`      | 總和             |
| `AVG()`      | 平均             |
| `COUNT(*)`   | 計算資料筆數（列數）     |
| `COUNT(欄位名)` | 計算筆數，但不會算 NULL |
| `MAX()`      | 找出最大值          |
| `MIN()`      | 找出最小值          |

---

## GROUP BY + HAVING

```sql
-- SUM + HAVING
SELECT Customer, SUM(Price) AS TotalSpent
FROM orders
GROUP BY Customer
HAVING SUM(Price) > 10000       -- 篩選總消費大於 10000 的客戶
ORDER BY TotalSpent DESC;

-- AVG + HAVING
SELECT Product, AVG(Price) AS AvgPrice
FROM order_details
GROUP BY Product
HAVING AVG(Price) > 500;        -- 篩選平均價格大於 500 的產品

-- COUNT + HAVING
SELECT Customer, COUNT(*) AS PurchaseCount
FROM orders
WHERE OrderDate >= '2024-01-01'
GROUP BY Customer
HAVING COUNT(*) >= 5;           -- 篩選購買次數大於等於 5 次的客戶
```

### WITH ROLLUP（單向小計）

```sql
SELECT 教授編號, 課程編號, COUNT(學號) AS 總數
FROM 班級
WHERE 教授編號 IN ('1001','1003')
GROUP BY 教授編號, 課程編號 WITH ROLLUP;
-- 只會記錄教授編號的小計
```

| 教授編號 | 課程編號 | 總數 |
|----------|----------|------|
| 1001 | C001 | 2 |
| 1001 | C002 | 1 |
| 1001 | NULL | 3（教授1001小計） |
| 1003 | C001 | 2 |
| 1003 | NULL | 2（教授1003小計） |
| NULL | NULL | 5（全部總計） |

### WITH CUBE（雙向小計）

```sql
SELECT 教授編號, 課程編號, COUNT(學號) AS 總數
FROM 班級
WHERE 教授編號 IN ('1001','1003')
GROUP BY 教授編號, 課程編號 WITH CUBE;
-- 記錄雙向小計
```

| 教授編號 | 課程編號 | 總數 |
|----------|----------|------|
| 1001 | C001 | 2 |
| 1001 | C002 | 1 |
| 1001 | NULL | 3（教授1001小計） |
| 1003 | C001 | 2 |
| 1003 | NULL | 2（教授1003小計） |
| NULL | C001 | 4（課程C001小計） |
| NULL | C002 | 1（課程C002小計） |
| NULL | NULL | 5（全部總計） |

### GROUPING SETS（自訂小計）

> 好處：可以自己決定要哪些小計，不像 ROLLUP / CUBE 固定產生。

```sql
SELECT 教授編號, 課程編號, COUNT(學號) AS 總數
FROM 班級
WHERE 教授編號 IN ('1001','1003')
GROUP BY GROUPING SETS (
    (教授編號, 課程編號),  -- 顯示教授 + 課程的分組結果
    (教授編號),            -- 顯示各教授的小計
    ()                     -- 顯示全部總計
);
```

| 教授編號 | 課程編號 | 總數 |
|----------|----------|------|
| 1001 | C001 | 2 |
| 1001 | C002 | 1 |
| 1003 | C001 | 2 |
| 1001 | NULL | 3（教授1001小計） |
| 1003 | NULL | 2（教授1003小計） |
| NULL | NULL | 5（全部總計） |

---

## JOIN

> **範例資料表**
>
> 學生：S001 小明 / S002 小美 / S003 小華
>
> 班級：S001 SQL / S002 Java / S004 Python

### INNER JOIN（內部合併）

只顯示兩表都有對應的資料。

```sql
SELECT * FROM 學生
INNER JOIN 班級 ON 學生.學號 = 班級.學號;
```

| 學號 | 姓名 | 課程 |
|------|------|------|
| S001 | 小明 | SQL |
| S002 | 小美 | Java |

### LEFT JOIN（左外部合併）

顯示左表全部資料，右表沒有對應則顯示 NULL。

```sql
SELECT * FROM 學生
LEFT JOIN 班級 ON 學生.學號 = 班級.學號;
```

| 學號 | 姓名 | 課程 |
|------|------|------|
| S001 | 小明 | SQL |
| S002 | 小美 | Java |
| S003 | 小華 | NULL |

### RIGHT JOIN（右外部合併）

顯示右表全部資料，左表沒有對應則顯示 NULL。

```sql
SELECT * FROM 學生
RIGHT JOIN 班級 ON 學生.學號 = 班級.學號;
```

| 學號   | 姓名   | 課程     |
| ---- | ---- | ------ |
| S001 | 小明   | SQL    |
| S002 | 小美   | Java   |
| S004 | NULL | Python |


### FULL JOIN（完整外部合併）

左右表全部顯示，沒有對應則顯示 NULL。

```sql
SELECT * FROM 學生
FULL JOIN 班級 ON 學生.學號 = 班級.學號;
```

| 學號   | 姓名   | 課程     |
| ---- | ---- | ------ |
| S001 | 小明   | SQL    |
| S002 | 小美   | Java   |
| S003 | 小華   | NULL   |
| S004 | NULL | Python |

### CROSS JOIN（交叉合併）

兩表所有組合（笛卡兒積）。

```sql
SELECT * FROM 學生
CROSS JOIN 班級;
```

### 自我合併（Self Join）

```sql
SELECT A.姓名 AS 員工姓名, B.姓名 AS 主管姓名
FROM 員工 A
INNER JOIN 員工 B
ON A.主管編號 = B.員工編號;
```

---

## UNION / INTERSECT / EXCEPT

> 注意：欄位數量必須相同、資料型態也要相容。

| 運算          | 說明                     |
| ----------- | ---------------------- |
| `UNION`     | 聯集，自動去除重複              |
| `UNION ALL` | 聯集，保留重複                |
| `INTERSECT` | 交集，只保留兩邊共同的資料          |
| `EXCEPT`    | 差集，只顯示第一個查詢中有、第二個沒有的資料 |

```sql
-- UNION
SELECT 姓名 FROM 學生
UNION
SELECT 姓名 FROM 老師;

-- INTERSECT
SELECT 姓名 FROM 學生
INTERSECT
SELECT 姓名 FROM 老師;

-- EXCEPT
SELECT 姓名 FROM 學生
EXCEPT
SELECT 姓名 FROM 老師;
```

---

## 子查詢

### FROM 子查詢（子查詢當暫時資料表）

```sql
SELECT 高薪員工.姓名, 高薪員工.電話, 高薪員工.薪水
FROM (
    SELECT 身份證字號, 姓名, 電話, 薪水
    FROM 員工
    WHERE 薪水 > 50000
) AS 高薪員工;
```

### WHERE 子查詢（子查詢當條件）

```sql
SELECT COUNT(*) AS 上課數
FROM 班級
WHERE 學號 = (
    SELECT 學號 FROM 學生
    WHERE 姓名 = '陳會安'
);
```

### 比較運算子子查詢

```sql
SELECT 身份證字號, 姓名, 電話, 薪水
FROM 員工
WHERE 薪水 >= (
    SELECT AVG(薪水) FROM 員工
);
```

### NOT IN 子查詢

```sql
SELECT * FROM 課程
WHERE 課程編號 NOT IN (
    SELECT 課程編號 FROM 班級
    WHERE 學號 = 'S004'
);
```

### IN 子查詢

```sql
SELECT * FROM 教授
WHERE 教授編號 IN (
    SELECT 教授編號 FROM 班級
    WHERE 學號 = (
        SELECT 學號 FROM 學生
        WHERE 姓名 = '江小魚'
    )
);
```

### ALL（滿足所有結果）

```sql
SELECT 姓名, 薪水
FROM 員工
WHERE 薪水 >= ALL (
    SELECT 薪水 FROM 員工
    WHERE 城市 = '台北'
);
```

### ANY / SOME（滿足任一結果）

```sql
SELECT 姓名, 薪水
FROM 員工
WHERE 薪水 >= ANY (
    SELECT 薪水 FROM 員工
    WHERE 城市 = '台北'
);
```

### EXISTS（是否存在資料）

```sql
SELECT 姓名 FROM 學生 S
WHERE EXISTS (
    SELECT * FROM 班級 C
    WHERE S.學號 = C.學號
);
```

### NOT EXISTS（是否不存在資料）

```sql
SELECT 姓名 FROM 學生 S
WHERE NOT EXISTS (
    SELECT * FROM 班級 C
    WHERE S.學號 = C.學號
);
```

---

## INSERT

```sql
-- 新增一筆資料
INSERT INTO 學生(學號, 姓名, 科系)
VALUES ('S001', '王小明', '資管系');

-- INSERT/SELECT：將查詢結果新增到另一張表
INSERT INTO 高薪員工(姓名, 電話, 薪水)
SELECT 姓名, 電話, 薪水
FROM 員工
WHERE 薪水 > 50000;
```

---

## UPDATE

```sql
-- 基本修改
UPDATE 學生
SET 科系 = '資工系'
WHERE 學號 = 'S001';

-- UPDATE 子查詢
UPDATE 員工
SET 薪水 = (
    SELECT AVG(薪水) FROM 員工
)
WHERE 部門 = '資訊部';

-- 合併更新（利用 JOIN）
UPDATE 員工
SET 員工.薪水 = 員工.薪水 + 5000
FROM 員工
INNER JOIN 部門 ON 員工.部門編號 = 部門.部門編號
WHERE 部門.部門名稱 = '資訊部';
```

---

## DELETE

```sql
-- 基本刪除
DELETE FROM 學生
WHERE 學號 = 'S001';

-- 子查詢刪除
DELETE FROM 班級
WHERE 學號 IN (
    SELECT 學號 FROM 學生
    WHERE 狀態 = '休學'
);

-- 合併刪除（利用 JOIN）
DELETE 班級
FROM 班級
INNER JOIN 學生 ON 班級.學號 = 學生.學號
WHERE 學生.狀態 = '退學';
```

---

## TRUNCATE

```sql
TRUNCATE TABLE 課程備份;
-- 清空整張資料表內容，但保留資料表結構
```

---

## MERGE

```sql
MERGE 員工 AS T          -- 目標資料表 (Target)
USING 新員工 AS S         -- 來源資料表 (Source)
ON T.員工編號 = S.員工編號 -- 比對條件
WHEN MATCHED THEN         -- 如果資料存在 → 更新
    UPDATE SET
        T.薪水 = S.薪水,
        T.部門 = S.部門
WHEN NOT MATCHED THEN     -- 如果資料不存在 → 新增
    INSERT (員工編號, 姓名, 薪水, 部門)
    VALUES (S.員工編號, S.姓名, S.薪水, S.部門)
WHEN NOT MATCHED BY SOURCE THEN  -- 目標表有但來源表沒有 → 刪除
    DELETE;
```

## VIEW（檢視表）

```sql
-- 建立
CREATE VIEW 高薪員工_檢視 (員工編號, 員工姓名, 員工薪水)
WITH ENCRYPTION          -- 加密 View 定義
AS
SELECT 員工編號, 姓名, 薪水
FROM 員工
WHERE 薪水 > 50000;

-- 修改
ALTER VIEW 高薪員工_檢視 AS
SELECT 員工編號, 姓名, 薪水 FROM 員工 WHERE 薪水 > 60000;

-- 刪除
DROP VIEW 高薪員工_檢視;

-- 重新命名
EXEC sp_rename '舊檢視表名稱', '新檢視表名稱';
```

> `ALTER VIEW` 不能直接改名，需用 `sp_rename`

---

## 常用選項

| 選項                   | 說明                         |
| -------------------- | -------------------------- |
| `WITH ENCRYPTION`    | 加密 View 定義，防止查看            |
| `WITH SCHEMABINDING` | 綁定來源資料表結構，建立後無法隨意修改欄位      |
| `WITH CHECK OPTION`  | 新增／修改資料時必須符合 WHERE 條件，否則拒絕 |

```sql
-- SCHEMABINDING 範例（需加 dbo.）
CREATE VIEW 員工檢視表 WITH SCHEMABINDING AS
SELECT 員工編號, 姓名 FROM dbo.員工;

-- WITH CHECK OPTION 範例
CREATE VIEW 生日_檢視_有WCO AS
SELECT 學號, 姓名, 生日 FROM 學生
WHERE 生日 > '2003-03-01'
WITH CHECK OPTION;

CREATE VIEW 生日_檢視_沒有WCO AS
SELECT 學號, 姓名, 生日 FROM 學生
WHERE 生日 > '2003-03-01';
```

### WITH CHECK OPTION 對 DML 的影響

| 操作 | 有 WCO | 無 WCO |
|------|--------|--------|
| `INSERT` 不符合 WHERE | ❌ 拒絕 | ✅ 允許 |
| `UPDATE` 後不符合 WHERE | ❌ 拒絕 | ✅ 允許 |
| `DELETE` 不在檢視結果中 | ❌ 無法刪除 | ❌ 無法刪除 |
| `DELETE` 在檢視結果中 | ✅ 成功 | ✅ 成功 |

> **DELETE 有無 WCO 結果相同**：只能刪除「檢視表查詢得到」的資料，查不到的資料無論如何都無法透過 View 刪除

---

## 三種類型

### 1. Row / Column Subset View（列欄篩選）
只顯示部分欄位或部分資料列，最基本的 View 用途。

### 2. Join View（合併檢視表）
```sql
CREATE VIEW 學生_班級_檢視 AS
SELECT 學生.學號, 學生.姓名, 課程.*, 教授.*
FROM 教授
INNER JOIN (課程 INNER JOIN (學生 INNER JOIN 班級 ON 學生.學號 = 班級.學號)
    ON 班級.課程編號 = 課程.課程編號)
ON 班級.教授編號 = 教授.教授編號;
```

### 3. Statistical Summary View（統計摘要）
```sql
CREATE VIEW 學分_檢視 AS
SELECT 學生.學號, COUNT(*) AS 修課數, SUM(課程.學分) AS 學分數
FROM 學生, 課程, 班級
WHERE 學生.學號 = 班級.學號 AND 課程.課程編號 = 班級.課程編號
GROUP BY 學生.學號;

-- 搭配 HAVING 進一步篩選
CREATE VIEW 高學分學生_檢視 AS
SELECT 學生.學號, SUM(課程.學分) AS 總學分
FROM 學生, 課程, 班級
WHERE 學生.學號 = 班級.學號 AND 課程.課程編號 = 班級.課程編號
GROUP BY 學生.學號
HAVING SUM(課程.學分) >= 12;
```

**常用聚合函數：** `COUNT()` / `SUM()` / `AVG()` / `MAX()` / `MIN()`

---

## VIEW重點整理

**View 常見用途**
- 隱藏部分欄位或資料列
- 簡化複雜查詢
- 提高資料安全性

**SELECT 內不可使用**
- `ORDER BY` / `COMPUTE BY` / `INTO`

**新增／修改／刪除注意**
- 資料來自原始資料表，仍需遵守原始資料表的完整性限制
- 有 `DISTINCT`、`GROUP BY`、`HAVING` 的 View 通常無法直接修改資料

# INDEX索引
- 用來提高搜尋效率
- 縮小查詢範圍
- 避免掃描整張表
## 基本語法

```sql
-- 建立一般索引
CREATE INDEX IX_學生_成績 ON 學生(成績);

-- 建立唯一索引
CREATE UNIQUE INDEX IX_學生_電話 ON 學生(電話);

-- 建立叢集索引（一張表只能一個）
CREATE CLUSTERED INDEX IX_員工_薪水 ON 員工(薪水);

-- 建立非叢集索引
CREATE NONCLUSTERED INDEX IX_員工_部門 ON 員工(部門);

ALTER INDEX IX_員工_部門 ON 員工 DISABLE; --停用
ALTER INDEX IX_員工_部門 ON 員工 REBUILD; --重建
DROP INDEX IX_員工_姓名 ON 員工; --刪除
```
> 停用後需 `REBUILD` 才能恢復使用

---
## 自動建立索引

| 條件約束 | 自動建立的索引類型 |
|------|------|
| `PRIMARY KEY` | Clustered Index（預設） |
| `UNIQUE` | Unique Nonclustered Index |

---
# M 路搜尋樹 & B-Tree
## M 路搜尋樹（M-Way Search Tree）
### 定義

|項目|上限|
|---|---|
|子節點（Child）|最多 **M** 個|
|鍵值（Key）|最多 **M-1** 個|

### 範例：4 路搜尋樹（M = 4）

```
        [20 | 40 | 60]
       /    |    |    \
    <20  20~40 40~60  >60
```

節點 `[20|40|60]` 有 3 個 Key、4 個 Child → 符合 M=4 的規則。

### 搜尋規則

以 `[20 | 40 | 60]` 為根節點：

|搜尋值|條件|走向|
|---|---|---|
|15|15 < 20|最左子樹|
|35|20 < 35 < 40|第二子樹|
|50|40 < 50 < 60|第三子樹|
|70|70 > 60|最右子樹|

### 缺點

```
10
  \
   20
     \
      30
        \
         40
```

節點不平衡 → 高度過高 → 搜尋效率下降。  
→ 因此出現 **B-Tree**。

---

## B-Tree

### 定義

B-Tree 是**平衡的 M 路搜尋樹**，保證所有葉節點高度相同。

### 規則（階數 M）

|節點類型|Key 下限|Child 下限|Key 上限|Child 上限|
|---|---|---|---|---|
|根節點|1|2（有子節點時）|M-1|M|
|非根節點|⌈M/2⌉ - 1|⌈M/2⌉|M-1|M|

---

## 索引類型比較

| 類型                 | 說明                           |
| ------------------ | ---------------------------- |
| Clustered Index    | 資料實際依此欄位排序，葉節點就是資料頁，一張表只能有一個 |
| Nonclustered Index | 不改變資料排序，額外建立索引頁，葉節點存放指標      |
| Unique Index       | 欄位值不可重複                      |
| Composite Index    | 由兩個以上欄位組成，遵守最左前綴法則           |
| Filtered Index     | 只對符合 WHERE 條件的資料建立索引，節省空間    |
| Columnstore Index  | 同欄位集中存放，適合 OLAP / BI 大量統計分析  |

---

## 複合索引與最左前綴法則

索引 `(城市, 郵遞區號)` 只能從最左欄位開始使用：

```sql
-- 可使用索引
SELECT * FROM 學生 WHERE 城市 = N'台北';
SELECT * FROM 學生 WHERE 城市 = N'台北' AND 郵遞區號 = '100';

-- 無法有效使用（跳過第一欄位）
SELECT * FROM 學生 WHERE 郵遞區號 = '100';
```

---

## INCLUDE 欄位索引

搜尋索引鍵時，可直接取得包含欄位的值，不需回資料表查詢：

```sql
CREATE INDEX 員工姓名索引
ON 員工(姓名)
INCLUDE(電話, 薪水);

-- 使用此索引，不需回表
SELECT 電話, 薪水 FROM 員工 WHERE 姓名 = '王小明';
```

---

## WITH 常見選項

| 選項                          | 說明                             |
| --------------------------- | ------------------------------ |
| `FILLFACTOR=x`              | 頁面只填滿 x%，保留 (100-x)% 空間，減少頁面分裂 |
| `IGNORE_DUP_KEY=ON`         | 唯一索引忽略重複值而非報錯                  |
| `STATISTICS_NORECOMPUTE=ON` | 不自動重新計算統計資料                    |
| `DROP_EXISTING=ON`          | 取代已存在的同名索引（用於修改索引）             |
| `PAD_INDEX`                 | 索引頁預留空間                        |

```sql
-- 重建全部索引並設定填滿率
ALTER INDEX ALL ON 員工 REBUILD WITH(FILLFACTOR=80);

-- 修改索引（加欄位、改為 UNIQUE）
CREATE UNIQUE INDEX 員工姓名_索引
ON 員工(姓名)
INCLUDE(電話, 薪水, 城市)
WITH(IGNORE_DUP_KEY=ON, DROP_EXISTING=ON);
```

---

## 篩選索引（Filtered Index）

只對符合條件的資料建立索引，適合搭配 `SPARSE` 稀疏欄位：

```sql
CREATE NONCLUSTERED INDEX 分公司數_索引
ON 廠商名單(分公司數)
WHERE 廠商類型 = 3;
```

---

## Columnstore Index

```sql
-- 非叢集（需指定欄位）
CREATE COLUMNSTORE INDEX 學生資料行_索引
ON 學生備份(姓名, 生日, 電話);

-- 叢集（不需指定欄位，涵蓋整張表）
CREATE CLUSTERED COLUMNSTORE INDEX 學生資料行_叢集索引
ON 學生備份2;
```

**Columnstore 不支援：** `WHERE` 篩選、`INCLUDE`、計算欄位、`binary` / `text` / `image` / `varchar(max)` 等型態

> 建立叢集 Columnstore 後資料表變唯讀（非叢集除外）

---

## 計算欄位索引

需先設定 7 個 Session 選項，且運算必須為決定性（不可用 `float`、`real`）：

### ANSI_NULLS

控制 NULL 的比較方式

```sql
SELECT *
FROM 學生
WHERE 姓名 = NULL;
```

永遠查不到資料。

正確寫法：

```sql
WHERE 姓名 IS NULL;
```

建立計算欄位索引、檢視表索引時必須：

```sql
SET ANSI_NULLS ON; -- NULL比較規則
```

---

### ANSI_PADDING

控制是否保留字串尾端空白

```sql
INSERT INTO 員工
VALUES ('Tom   ');
```

ANSI_PADDING ON：

```text
Tom___
```

ANSI_PADDING OFF：

```text
Tom
```

建立計算欄位索引、檢視表索引時必須：

```sql
SET ANSI_PADDING ON; -- 保留尾端空白
```

---

### ANSI_WARNINGS

控制是否顯示警告訊息

```sql
SELECT 100 / 0;
```

結果：

```text
Divide by zero error
```

建立計算欄位索引、檢視表索引時必須：

```sql
SET ANSI_WARNINGS ON; -- 顯示警告
```

---

### ARITHABORT

發生算術錯誤時立即停止查詢

```sql
SELECT 100 / 0;
```

結果：

```text
錯誤
查詢停止
```

建立計算欄位索引、檢視表索引時必須：

```sql
SET ARITHABORT ON; -- 算術錯誤終止
```

---

### CONCAT_NULL_YIELDS_NULL

NULL 與字串串接時結果為 NULL

```sql
SELECT 'ABC' + NULL;
```

結果：

```text
NULL
```

建立計算欄位索引、檢視表索引時必須：

```sql
SET CONCAT_NULL_YIELDS_NULL ON; -- NULL串接結果為NULL
```

---

### QUOTED_IDENTIFIER

允許雙引號作為資料表或欄位名稱識別字

```sql
SELECT "姓名"
FROM 學生;
```

建立計算欄位索引、檢視表索引時必須：

```sql
SET QUOTED_IDENTIFIER ON; -- 雙引號識別字
```

---

### NUMERIC_ROUNDABORT

控制四捨五入是否產生錯誤

```sql
DECLARE @x DECIMAL(5,2);
SET @x = 123.456;
```

結果：

```text
123.46
```

建立計算欄位索引、檢視表索引時必須：

```sql
SET NUMERIC_ROUNDABORT OFF; -- 關閉四捨五入錯誤
```

---
## 檢視表索引
必須先建立 `UNIQUE CLUSTERED INDEX`，且 View 需使用 `WITH SCHEMABINDING`：
```sql
-- 建立可索引的 View（需 COUNT_BIG，不可用 COUNT）
CREATE VIEW dbo.學生上課教室_檢視
WITH SCHEMABINDING AS
SELECT 學生.學號, 班級.教室, COUNT_BIG(*) AS 上課數
FROM dbo.學生
INNER JOIN dbo.班級 ON 學生.學號 = 班級.學號
GROUP BY 學生.學號, 班級.教室;
GO

-- 第一步：必須是 UNIQUE CLUSTERED
CREATE UNIQUE CLUSTERED INDEX 上課報表_索引
ON dbo.學生上課教室_檢視(學號, 教室);

-- 第二步：再建非叢集索引
CREATE NONCLUSTERED INDEX 教室_索引
ON 學生上課教室_檢視(教室)
INCLUDE(學號, 上課數);
```

---

## 執行計畫常見名詞

| 名稱 | 說明 | 效率 |
|------|------|------|
| Index Seek | 直接透過索引定位資料 | 最快 |
| Index Scan | 掃描整個索引 | 中 |
| Clustered Index Scan | 掃描整個主鍵索引 | 較慢 |
| Table Scan | 掃描整張資料表（無索引） | 最慢 |

---

## 重點整理

**適合建立索引：** PK、FK、JOIN、WHERE、ORDER BY、常搜尋欄位

**不適合建立索引：** 性別、Y/N、BIT、重複值很多的欄位（區分度太低）

**索引優缺點**
- 優點：加速查詢、排序、JOIN
- 缺點：增加磁碟空間，INSERT / UPDATE / DELETE 較慢

**限制**
- 1 個 Clustered Index
- 249 個 Nonclustered Index
- 複合索引最多 16 欄，總長度 ≤ 900 Bytes
- `ntext`、`text`、`image` 不能建立索引

# Transact-SQL
- ANSI-SQL 主要提供資料查詢與維護功能  
- T-SQL 是 SQL Server 擴充版 SQL  
- 增加程式設計能力
T-SQL 可以建立：
- 批次(Batch)  
```sql
SELECT * FROM 學生;
SELECT * FROM 課程;
SELECT * FROM 成績;
-- 多個 T-SQL 指令集合稱為 Batch
-- SQL Server 會一起編譯
-- 產生一份 Execution Plan(執行計畫)
```
- 預存程序(Stored Procedure)  
- 自訂函數(Function)  
- 觸發程序(Trigger)

### GO
```sql
USE 教務系統;
GO

CREATE VIEW 課程_高學分
AS
SELECT *
FROM 課程
WHERE 學分 >= 4;
GO

SELECT *
FROM 課程_高學分;
-- GO 表示批次結束  
-- GO 不是 T-SQL 指令  
-- 是 SSMS 與 SQLCMD 使用的分隔符號
```
### 註解
```sql
--多行註解
/*
我是註解第一行
我是註解第二行
 */

--單行註解
--我是單行註解範例
```
### PRINT
```sql
PRINT 'This is a test.'; -- 顯示訊息
PRINT N'你好'; -- N 表示 Unicode
```
### 輸出變數
```sql
DECLARE @msg VARCHAR(50) = 'Hello';
PRINT @msg; -- 顯示變數內容
```
### USE
```sql
USE 教務系統; -- 切換目前使用資料庫
```
## 變數
### 宣告變數
```sql
DECLARE @balance INT; -- 宣告整數變數
DECLARE @total INT = 100; -- 宣告時給初值

DECLARE @myName VARCHAR(12), -- 姓名
        @amount INT = 123,   -- 金額
        @counter INT = 5;    -- 計數器
        -- 多變數宣告
        -- 區域變數一定以 @ 開頭

DECLARE @balance INT; -- @balance = NULL
DECLARE @total INT = 100;

PRINT @balance; -- PRINT 不會顯示 NULL
PRINT @total;
```
變數用途:
- 儲存暫時資料
- 計數器 常搭配 WHILE 使用
- 條件判斷 IF 判斷條件

### WHERE 條件
```sql
DECLARE @c_no VARCHAR(5);  
SELECT @c_no = 'CS101';  
SELECT 課程編號,  
名稱,  
學分  
FROM 課程  
WHERE 課程編號 = @c_no; -- 變數當where 條件
```

### SET 指定變數值
```sql
DECLARE @balance INT;
SET @balance = 1000; -- 指定固定值

DECLARE @balance INT;
SET @balance = 1000;
SET @balance = @balance * 1.02; -- 使用運算式
PRINT '餘額:' + CAST(@balance AS CHAR);

DECLARE @total INT;
SET @total = -- 使用查詢結果指定，將查詢結果存入變數
(
    SELECT SUM(學分)
    FROM 課程
);
PRINT '學分數:' + CAST(@total AS CHAR);
```

### 位元運算子

| 運算子 | 說明  | 規則                                                |
| --- | --- | ------------------------------------------------- |
| &   | AND | 1 and 1=1 ,  0 and 0 = 0  ,  0 and 1 / 1 and 0 =0 |
| \|  | OR  | 只要有一個1就是1                                         |
| ^   | XOR | 相同=0  ,  不同=1                                     |
| ~   | NOT | SQL Server 的 INT 是 **32位元** >> 0 變 1、1 變 0（取反）    |
### T-SQL 運算子優先順序（由高到低）  

| 優先順序 | 運算子                                           | 說明                     |
| ---- | --------------------------------------------- | ---------------------- |
| 1    | `~`                                           | 位元 NOT                 |
| 2    | `*` `/` `%`                                   | 乘法、除法、餘數               |
| 3    | `+` `-` `+`(字串連接) `&` `^` `\|`                | 加減法、字串連接、位元 AND/XOR/OR |
| 4    | `=` `>` `<` `>=` `<=` `<>` `!=` `!>` `!<`     | 比較運算子                  |
| 5    | `NOT`                                         | 邏輯 NOT                 |
| 6    | `AND`                                         | 邏輯 AND                 |
| 7    | `ALL` `ANY` `BETWEEN` `IN` `LIKE` `OR` `SOME` | 條件判斷                   |
| 8    | `=`                                           | 指定運算子                  |
### SELECT 指定變數值
```sql
DECLARE @myName VARCHAR(12);  
SELECT @myName = 'Bika';  
SELECT @myName AS 姓名;
-- 字串指定

DECLARE @myName VARCHAR(12);
DECLARE @myCity VARCHAR(10);
SELECT @myName = 姓名,
       @myCity = 城市
FROM 員工
WHERE 薪水 >= 60000;
SELECT @myName AS 姓名,
       @myCity AS 城市;
-- 如果查到多筆  
-- 只保留最後一筆資料
```
### 變數當 WHERE 條件
```sql
DECLARE @c_no VARCHAR(5);
SELECT @c_no = 'CS101';
SELECT 課程編號,
       名稱,
       學分
FROM 課程
WHERE 課程編號 = @c_no; -- 變數可直接放在 WHERE
```
### 變數種類
```sql
--純量變數 (Scalar Variable)
DECLARE @name VARCHAR(20); -- 一次只能存一個值
DECLARE @age INT;

--資料表變數 (Table Variable)
DECLARE @students TABLE
(
    std_no CHAR(4),
    name VARCHAR(12)
);
--插入資料
INSERT @students
SELECT 學號, 姓名
FROM 學生
WHERE 性別 = '男';
--查詢資料
SELECT *
FROM @students; -- 類似暫存資料表

--注意不可寫 因宣告變數是暫存
DECLARE @myName VARCHAR(12);
GO
SELECT @myName='陳佳妤';
GO
-- GO 後變成新的 Batch
-- @myName 已不存在
-- 會報錯
```
### SQL Server 系統函數
```sql
SELECT @@IDENTITY; -- 取得最近新增的 Identity 值

SELECT *
FROM 課程;
SELECT @@ROWCOUNT; -- 取得上一個指令影響筆數

SELECT @@ERROR;
-- 取得上一個錯誤代碼
-- 沒錯誤為0

SELECT @@SERVERNAME; -- 顯示SQL Server名稱
```

## 類型轉換概念  
  
當運算式中有不同資料型態時，需要先進行資料型態轉換。  
  
例如：  
  
```sql  
int + smallint  
```  
  
SQL Server 會先將 smallint 轉成 int 再運算。  
  
---  
  
## 類型轉換種類  
  
### 1. 隱含轉換 (Implicit Conversion)  
  
SQL Server 自動轉換。  
  
```sql  
DECLARE @a int = 10  
DECLARE @b smallint = 5  
  
SELECT @a + @b  
```  
  
實際：  
  
```sql  
int + int  
```  
  
---  
  
### 2. 強迫轉換 (Explicit Conversion)  
  
由程式設計者手動轉換。  
  
使用：  
  
```sql  
CAST()  
CONVERT()  
```  
  
---  
  
# CAST 運算子  
  
## 語法  
  
```sql  
CAST(資料 AS 資料型態)  
```  
  
---  
  
## 整數轉字串  
  
```sql  
DECLARE @total int = 100  
  
PRINT '總分：' + CAST(@total AS char)  
```  
  
結果：  
  
```text  
總分：100  
```  
  
---  
  
## 字串轉日期  
  
```sql  
PRINT CAST('2023-06-30' AS datetime)  
```  
  
---  
  
# CONVERT 函數  
  
## 語法  
  
```sql  
CONVERT(資料型態, 資料)  
```  
  
---  
  
## 整數轉字串  
  
```sql  
DECLARE @total int = 100  
  
PRINT '總分：' + CONVERT(char,@total)  
```  
  
---  
  
## 字串轉日期  
  
```sql  
PRINT CONVERT(datetime,'2023-06-30')  
```  
  
---  
  
# CAST 與 CONVERT 比較  
  
| 項目           | CAST | CONVERT |
| ------------ | ---- | ------- |
| ANSI標準       | ✔    | ✘       |
| SQL Server專用 | ✘    | ✔       |
| 可讀性          | 較佳   | 普通      |
| 日期格式控制       | ✘    | ✔       |
  
---

# 流程控制結構 (Control Structures)  
流程控制可依條件決定執行哪些指令。  
分為：  
1. 條件控制  
2. 迴圈控制  
---  
# BEGIN / END 指令區塊  
## 用途  
把多個 SQL 指令包成一個區塊。  

```sql  
DECLARE @dbName varchar(10)='教務系統'  
IF @dbName='教務系統'  
BEGIN  
PRINT '資料庫：教務系統'  
PRINT '資料表：教授、課程'  
END  
```  

---  
  
# IF / ELSE 條件控制  

## 單一指令  
  
```sql  
IF @score >= 60  
PRINT '及格'  
ELSE  
PRINT '不及格'  
```  
  
---  
  
## 多個指令  
  
```sql  
IF @score >= 60  
BEGIN  
  
PRINT '及格'  
PRINT '可以升級'  
  
END  
ELSE  
BEGIN  
  
PRINT '不及格'  
PRINT '請補考'  
  
END  
```  
  
---  
  
# IF 搭配 COUNT  
  
判斷資料是否存在  
  
```sql  
IF (SELECT COUNT(*) FROM 教授)>=1
PRINT '有資料'
ELSE
PRINT '沒有資料'  
```  
  
---  
  
# DB_ID()  
  
檢查資料庫是否存在  
  
```sql  
IF DB_ID('教務系統') IS NOT NULL  
  
PRINT '找到資料庫'  
  
ELSE  
  
PRINT '找不到資料庫'  
```  
  
---  
  
# OBJECT_ID()  
  
檢查資料表是否存在  
  
```sql  
IF OBJECT_ID('課程') IS NOT NULL  
  
PRINT '找到資料表'  
  
ELSE  
  
PRINT '找不到資料表'  
```  
  
---  
  
# RETURN  

## 用途  
中斷程式執行  
  
---  
  
## 語法  

```sql  
IF @count > 0  
BEGIN  
  
PRINT '已有資料'  
  
RETURN  
  
END  
  
PRINT '後面不會執行'  
```  
  
---  
  
# CASE 多條件函數  
  
CASE 不是流程控制  
  
CASE 是回傳值的函數  
  
---  
  
# 簡單 CASE (Simple CASE)  

## 語法  
  
```sql  
SELECT 學號,  
姓名,  
  
CASE 性別  
  
WHEN '男' THEN 'Male'  
WHEN '女' THEN 'Female'  
  
ELSE 'N/A'  
  
END AS 學生性別  
  
FROM 學生  
```  
  
---  
  
# 搜尋 CASE (Searched CASE)  
  
## 語法  
  
```sql  
DECLARE @age int=25  
  
SELECT  
CASE   
WHEN @age < 15 THEN '小孩'  
WHEN @age < 60 THEN '成人'  
WHEN @age < 100 THEN '老人'  
  
ELSE 'Free'  
  
END  
```  
  
結果：  
```text  
成人  
```  
  
---  
  
# WHILE 迴圈  
## 範例：1加到5  
  
```sql  
DECLARE @counter int=1  
DECLARE @total int=0  
  
WHILE @counter<=5  
BEGIN  
  
SET @total=@total+@counter  
  
SET @counter=@counter+1  
  
END  
  
PRINT @total  
```  
  
結果：  
  
```text  
15  
```  
  
---  
  
# BREAK  
跳出迴圈  
```sql  
WHILE 1=1  
BEGIN  
IF @num=10  
BREAK  
END  
```  
  
---  
  
# CONTINUE  
跳過本次迴圈  
```sql  
WHILE @num<=10  
BEGIN  
SET @num=@num+1  
IF @num=5  
CONTINUE  
PRINT @num  
END  
```  
  
---  
  
# 巢狀 WHILE  
迴圈裡再放迴圈  
```sql  
WHILE @book_id<2  
BEGIN  
SET @book_id=@book_id+1  
WHILE @category_id<3  
BEGIN  
SET @category_id=@category_id+1  
END
END  
```

---
# BREAK 關鍵字跳出迴圈  
  
## 功能  
  
當 WHILE 迴圈尚未結束時，可使用 BREAK 強制中斷迴圈。  
  
## 語法  
  
```sql  
WHILE 條件  
BEGIN  
IF 條件  
BREAK  
END  
```  
  
---  
  
## 範例：計算 1~5 總和  
  
```sql  
DECLARE @counter int, @total int  
  
SET @total = 0  
SET @counter = 1  
  
WHILE @counter <= 15  
BEGIN  
SET @total = @total + @counter  
  
PRINT '計數：' + CAST(@counter AS char)  
  
SET @counter = @counter + 1  
  
IF @counter > 5  
BREAK  
END  
  
PRINT '1加到5 = ' + CAST(@total AS char)  
```  
  
### 執行流程  
  
```text  
counter=1 → 加入總和  
counter=2 → 加入總和  
counter=3 → 加入總和  
counter=4 → 加入總和  
counter=5 → 加入總和  
counter=6 → BREAK  
```  
  
### 結果  
  
```text  
1+2+3+4+5 = 15  
```  
  
---  
  
# CONTINUE 關鍵字繼續迴圈  
  
## 功能  
  
略過本次迴圈剩餘程式碼，直接執行下一次迴圈。  
  
## 語法  
  
```sql  
WHILE 條件  
BEGIN  
IF 條件  
CONTINUE  
END  
```  
  
---  
  
## 範例：計算 1~100 奇數總和  
  
```sql  
DECLARE @counter int, @total int  
  
SET @total = 0  
SET @counter = 0  
  
WHILE @counter <= 99  
BEGIN  
SET @counter = @counter + 1  
  
IF @counter % 2 = 0  
CONTINUE  
  
SET @total = @total + @counter  
END  
  
PRINT '總和：' + CAST(@total AS char)  
```  
  
### 執行流程  
  
```text  
1 → 加總  
2 → CONTINUE  
3 → 加總  
4 → CONTINUE  
...  
99 → 加總  
```  
  
### 結果  
  
```text  
1+3+5+...+99 = 2500  
```  
  
---  
  
# GOTO 跳躍至指定標籤  
  
## 功能  
  
直接跳到指定標籤(Label)繼續執行。  
  
## 語法  
  
```sql  
GOTO 標籤名稱  
```  
  
---  
  
## 標籤語法  
  
```sql  
標籤名稱:  
```  
  
---  
  
## BREAK 與 GOTO 差異  
  
| 關鍵字      | 功能         |
| -------- | ---------- |
| BREAK    | 跳出目前 WHILE |
| GOTO     | 跳到指定標籤位置   |
| CONTINUE | 直接進入下一輪迴圈  |
  
---  
  
## 範例  
  
```sql  
-- 宣告兩個整數變數  
DECLARE @book_Id int, @category_Id int  
  
-- 建立 TextBooks 資料表  
CREATE TABLE TextBooks  
(  
book_Id int, -- 書籍編號  
category_Id int -- 類別編號  
)  
  
-- 初始化變數  
SET @book_Id = 0  
SET @category_Id = 0  
  
-- 外層迴圈：book_Id 由 1 跑到 2  
WHILE @book_Id < 2  
BEGIN  
  
-- book_Id +1  
SET @book_Id = @book_Id + 1  
  
-- 內層迴圈：category_Id 由 1 跑到 3  
WHILE @category_Id < 3  
BEGIN  
  
-- category_Id +1  
SET @category_Id = @category_Id + 1  
  
-- 當 book_Id=1 且 category_Id=3 時  
-- 直接跳到 BREAK_POINT 標籤  
IF @book_Id = 1 AND @category_Id = 3  
GOTO BREAK_POINT  
  
-- 新增資料到 TextBooks  
INSERT INTO TextBooks  
VALUES(@book_Id,@category_Id)  
  
END  
  
-- 內層迴圈結束後重設 category_Id  
SET @category_Id = 0  
  
END  
  
-- GOTO 會跳到這裡  
BREAK_POINT:  
  
-- 顯示目前資料  
SELECT * FROM TextBooks  
  
-- 刪除資料表  
DROP TABLE TextBooks
```  
  
### 結果  
  
```text  
book_id category_id  
-------------------  
1 1  
1 2  
```  
  
當：  
  
```sql  
@book_Id = 1  
@category_Id = 3  
```  
  
成立時直接跳到：  
  
```sql  
BREAK_POINT:  
```  
  
所以只新增兩筆資料。  
  
---  
  
# WAITFOR 暫停執行  
  
## 功能  
  
讓 SQL Server 延遲執行指定時間。  
  
## 語法  
  
## DELAY 範例  
  
延遲 3 秒執行。  
```sql  
WAITFOR DELAY '00:00:03'  
  
SELECT *  
FROM 學生  
```  
  
---  
  
## TIME 範例  
  
晚上 11 點才執行。  
```sql  
WAITFOR TIME '23:00'  
  
SELECT *  
FROM 員工  
```  
  
---  
  
# IIF() 函數  
  
## 功能  

類似 IF ELSE。  
依條件回傳兩個值其中之一。  
## 語法  
  
```sql  
DECLARE @math int = 65  
DECLARE @english int = 70  
  
DECLARE @result varchar(10)  
  
SET @result =  
IIF(@math > @english,  
'數學高',  
'英文高')  
PRINT @result  
```  

  
### 結果  
  
```text  
英文高
```  
  
---  
  
## 複合條件  
  
```sql  
DECLARE @a int = 55  
DECLARE @b int = 40  
  
SELECT  
IIF(@a > @b AND @b > 35,  
'TRUE',  
'FALSE')  
AS 結果  
```  
  
### 結果  
  
```text  
TRUE  
```  
  
---  
  
# CHOOSE() 函數  
  
## 功能  
  
根據索引值回傳清單中的某個值。  
  
## 語法  
  
```sql  
CHOOSE(索引值, 值1, 值2, 值3...)  
```  
  
### 對應關係  
  
```text  
1 → 值1  
2 → 值2  
3 → 值3  
...  
```  
  
---  
  
## 範例  
  
```sql  
DECLARE @type int  
  
SET @type = 2  
  
DECLARE @result varchar(10)  
  
SET @result =  
CHOOSE(@type,  
'全票',  
'半票',  
'敬老票',  
'免費')  
  
PRINT @result  
```  
  
### 結果  
  
```text  
半票  
```  
  
---  
## TRY / CATCH 錯誤處理  
  
T-SQL 提供類似 Java、C# 的 try/catch 機制。  
  
用途：  
  
- 捕捉執行期間錯誤  
- 避免程式直接中斷  
- 顯示錯誤資訊  
- 自訂錯誤處理流程  
  
---  
  
## TRY / CATCH 基本語法  
  
```sql  
BEGIN TRY  
  
-- 可能發生錯誤的程式  
  
END TRY  
  
BEGIN CATCH  
  
-- 錯誤處理程式  
  
END CATCH  
```  
  
---  
  
## 執行流程  
  
```text  
TRY 區塊  
↓  
沒有錯誤  
↓  
程式繼續執行  
  
----------------  
  
TRY 區塊  
↓  
發生錯誤  
↓  
跳到 CATCH  
↓  
執行錯誤處理  
```  
  
---  
  
## 除以零錯誤範例  
  
```sql  
BEGIN TRY  
  
SELECT 1/0 -- 除以零錯誤  
  
END TRY  
  
BEGIN CATCH  
  
SELECT  
ERROR_NUMBER() AS ErrorNumber,  
ERROR_SEVERITY() AS ErrorSeverity,  
ERROR_STATE() AS ErrorState,  
ERROR_PROCEDURE() AS ErrorProcedure,  
ERROR_LINE() AS ErrorLine,  
ERROR_MESSAGE() AS ErrorMessage  
  
END CATCH  
```  
  
---  
  
## 執行結果  
  
```text  
ErrorNumber = 8134  
ErrorSeverity = 16  
ErrorState = 1  
ErrorProcedure = NULL  
ErrorLine = 2  
ErrorMessage = 遇到除以零的錯誤  
```  
  
---  
  
## 錯誤嚴重性等級（Severity）  
  
SQL Server 錯誤等級：  
  
```text  
1 ~ 25  
```  
  
| 等級 | 說明 |  
|--------|--------|  
| 1~10 | 提示訊息 |  
| 11~18 | 一般錯誤 |  
| 19~25 | 嚴重錯誤 |  
  
---  
  
## 錯誤處理函數  
  
### ERROR_NUMBER()  
  
```sql  
ERROR_NUMBER()  
```  
  
回傳：  
  
```text  
錯誤編號  
```  
  
---  
  
### ERROR_MESSAGE()  
  
```sql  
ERROR_MESSAGE()  
```  
  
回傳：  
  
```text  
完整錯誤訊息  
```  
  
---  
  
### ERROR_SEVERITY()  
  
```sql  
ERROR_SEVERITY()  
```  
  
回傳：  
  
```text  
錯誤嚴重性等級  
```  
  
---  
  
### ERROR_STATE()  
  
```sql  
ERROR_STATE()  
```  
  
回傳：  
  
```text  
錯誤狀態碼  
```  
  
---  
  
### ERROR_LINE()  
  
```sql  
ERROR_LINE()  
```  
  
回傳：  
  
```text  
錯誤發生行數  
```  
  
---  
  
### ERROR_PROCEDURE()  
  
```sql  
ERROR_PROCEDURE()  
```  
  
回傳：  
  
```text  
發生錯誤的預存程序名稱  
```  
  
---  
  
# RAISERROR()  
  
## 功能  
  
手動產生錯誤訊息。  
  
用途：  
  
- 自訂錯誤  
- 配合 TRY/CATCH  
- 驗證資料  
  
---  
  
## 新增自訂錯誤訊息  
  
使用：  
  
```sql  
sp_addmessage  
```  
  
---  
  
## 語法  
  
```sql  
EXEC sp_addmessage  
訊息編號,  
嚴重等級,  
'錯誤訊息',  
@lang='使用語言'  
```  
  
---  
  
## 規則  
  
### 訊息編號  
  
```text  
必須大於 50000  
```  
  
例如：  
  
```sql  
55555  
```  
  
---  
  
### 語言  
  
英文版：  
  
```sql  
us_english  
```  
  
中文版：  
  
```sql  
繁體中文  
```  
  
---  
  
## 建立自訂錯誤訊息  
  
```sql  
EXEC sp_addmessage  
55555,  
5,  
'Error! grade < 0!',  
@lang='us_english'  
  
GO  
  
EXEC sp_addmessage  
55555,  
5,  
'成績為負數的錯誤!',  
@lang='繁體中文'  
```  
  
---  
  
# RAISERROR 產生錯誤  
  
## 語法  
  
```sql  
RAISERROR  
(  
錯誤編號,  
嚴重等級,  
錯誤狀態  
)  
```  
  
---  
  
## 參數  
  
### 錯誤編號  
  
```text  
自訂錯誤編號  
```  
  
例如：  
  
```sql  
55555  
```  
  
---  
  
### 嚴重等級  
  
```text  
1 ~ 25  
```  
  
---  
  
### 錯誤狀態  
  
```text  
1 ~ 127  
```  
  
自訂即可。  
  
---  
  
## RAISERROR 範例  
  
```sql  
BEGIN TRY  
  
RAISERROR(55555,17,10)  
  
END TRY  
  
BEGIN CATCH  
  
SELECT  
ERROR_NUMBER() AS ErrorNumber,  
ERROR_SEVERITY() AS ErrorSeverity,  
ERROR_STATE() AS ErrorState,  
ERROR_PROCEDURE() AS ErrorProcedure,  
ERROR_LINE() AS ErrorLine,  
ERROR_MESSAGE() AS ErrorMessage  
  
END CATCH  
```  
  
---  
  
## 執行結果  
  
```text  
ErrorNumber = 55555  
ErrorSeverity = 17  
ErrorState = 10  
ErrorMessage = 成績為負數的錯誤!  
```  
  
---  
  
## 考試重點  
  
```text  
Severity > 10  
→ 可以被 TRY/CATCH 捕捉  
  
Severity <= 10  
→ 只顯示訊息  
→ 不會進入 CATCH  
```  
  
---  
  
# THROW  
  
## 功能  
  
SQL Server 新版錯誤拋出指令。  
  
用途：  
  
- 取代 RAISERROR  
- 拋出例外  
- 重新拋出例外  
  
---  
  
## 語法  
  
```sql  
THROW  
(  
錯誤編號,  
錯誤訊息,  
狀態值  
);  
```  
  
---  
  
## 參數  
  
### 錯誤編號  
  
```text  
>= 50000  
```  
  
---  
  
### 錯誤訊息  
  
```text  
自訂訊息文字  
```  
  
---  
  
### 狀態值  
  
```text  
0 ~ 255  
```  
  
---  
  
## THROW 自訂錯誤範例  
  
```sql  
BEGIN TRY  
  
SELECT 1/0  
  
END TRY  
  
BEGIN CATCH  
  
THROW 51000,  
'除以零的錯誤...',  
1  
  
END CATCH  
```  
  
---  
  
## 執行結果  
  
```text  
Msg 51000  
除以零的錯誤...  
```  
  
---  
  
## THROW 無參數  
  
只能出現在：  
  
```sql  
BEGIN CATCH  
```  
  
內。  
  
---  
  
## THROW 重拋例外
  
```sql  
USE tempdb  
GO  
  
CREATE TABLE MyTEMPDB  
(  
ID INT PRIMARY KEY  
)  
BEGIN TRY
INSERT MyTEMPDB(ID)  
VALUES(1)  
  
INSERT MyTEMPDB(ID)  
VALUES(1)  
  
END TRY  
  
BEGIN CATCH  
  
THROW  
  
END CATCH  
```  
  
---  
  
## 執行流程  
  
```text  
第一次 INSERT  
↓  
成功  
  
第二次 INSERT  
↓  
主鍵重複  
  
發生錯誤  
↓  
進入 CATCH  
↓  
THROW  
↓  
重新丟出原本錯誤  
```  
  
---  
  
# RAISERROR vs THROW  
  
| 比較 | RAISERROR | THROW |  
|--------|--------|--------|  
| SQL Server 舊版 | ✔ | ✘ |  
| SQL Server 新版 | ✔ | ✔ |  
| 自訂錯誤 | ✔ | ✔ |  
| 重新拋出原錯誤 | 較麻煩 | ✔ |  
| 官方推薦 | ✘ | ✔ |  
  
---



# 預存程序（Stored Procedure）

---

## CREATE PROCEDURE（建立預存程序）

### 單一參數

```sql
CREATE PROCEDURE 課程查詢
    @c_no char(5)
AS
BEGIN
    SELECT 課程編號, 名稱, 學分
    FROM 課程
    WHERE 課程編號 = @c_no
END
```

### 多參數 + IF 條件

```sql
CREATE PROCEDURE 員工查詢
    @salary money,
    @tax    money
AS
BEGIN
    IF @salary <= 0
        SET @salary = 30000
    IF @tax <= 0
        SET @tax = 300
    SELECT 身份證字號, 姓名,
           (薪水-扣稅) AS 所得額
    FROM 員工
    WHERE 薪水 >= @salary
      AND 扣稅 >= @tax
END
```

---

## EXEC（執行預存程序）

### 基本語法

```sql
-- 位置順序傳入
EXEC[UTE] 預存程序名稱 參數值1, 參數值2 [, ...]

-- 名稱傳入
EXEC[UTE] 預存程序名稱 @參數名稱1=參數值1,
                       @參數名稱2=參數值2 [, ...]
```

- **位置順序**：參數數量與順序需與建立時相同
- **名稱方式**：順序不需與建立時相同，用 `=` 指定參數值

### 範例

```sql
-- 名稱方式
EXEC 課程查詢 @c_no = 'CS101'

-- 位置順序方式
EXEC 員工查詢 50000, 500
```

---

## 預設值參數（Optional Parameters）

參數可以指定預設值，表示該參數為選項參數，可有可無。

### 語法

```sql
@參數1 資料類型 [=預設值],
@參數2 資料類型 [=預設值] [, ...]
```

> 如果使用**名稱方式**呼叫，沒有列出的參數就使用預設值。
> 如果使用**位置方式**，請用 `DEFAULT` 關鍵字表示此參數使用預設值。

### 範例

```sql
CREATE PROCEDURE 地址查詢
    @city   char(5)     = '台北',
    @street varchar(30) = '中正路'
AS
BEGIN
    SELECT 身份證字號, 姓名,
           (薪水-扣稅) AS 所得額,
           (城市+街道) AS 地址
    FROM 員工
    WHERE 城市 LIKE @city
      AND 街道 LIKE @street
END
```

---

## 預設值參數 — 執行範例

```sql
-- 名稱方式（只傳一個，另一個使用預設值）
EXEC 地址查詢 @city = '桃園'

-- 位置方式（第 2 個參數用 DEFAULT 表示使用預設值）
EXEC 地址查詢 '桃園', DEFAULT
```

---

## 巢狀呼叫（Nesting）

「巢狀呼叫」是指在預存程序中呼叫另一個預存程序。

- T-SQL 最多支援 **32 層**巢狀呼叫，超過就會中止執行
- 可以使用 `@@NESTLEVEL` 系統函數取得目前呼叫的層數

```sql
CREATE PROCEDURE 呼叫程序
    @proc_name varchar(30)
AS
PRINT '開始層數: ' + CAST(@@NESTLEVEL AS char)
EXEC @proc_name
PRINT '結束層數: ' + CAST(@@NESTLEVEL AS char)
GO

CREATE PROCEDURE 測試程序
AS
PRINT '層數: ' + CAST(@@NESTLEVEL AS char)
```

```sql
-- 執行（巢狀呼叫，會再呼叫【測試程序】）
EXEC 呼叫程序 '測試程序'
```

---

## 預存程序的傳回值

預存程序可以傳回資訊：
- 使用 `RETURN` 關鍵字傳回**整數值**（表示執行狀態）
- 使用 `OUTPUT` 關鍵字將**參數值**傳回呼叫者

---

## 使用 RETURN 關鍵字

### 語法

```sql
RETURN [整數運算式]
```

- 執行到 `RETURN` 時，立刻中止程序執行並傳回整數
- 未指定傳回值時，預設傳回 `0`
- 傳回非零值表示執行錯誤，傳回 `0` 表示執行成功
- 可使用 `@@ERROR` 系統函數取得 T-SQL 指令的錯誤碼

### 執行語法

```sql
EXEC[UTE] @傳回值變數 = 預存程序名稱 參數值 [, ...]
```

### 範例：新增課程（含錯誤判斷）

```sql
CREATE PROCEDURE 新增課程
    @c_no    char(5),
    @title   varchar(30),
    @credits int
AS
BEGIN
    DECLARE @errorNo int
    INSERT INTO 課程
    VALUES (@c_no, @title, @credits)
    SET @errorNo = @@ERROR
    IF @errorNo <> 0
    BEGIN
        IF @errorNo = 2627
            PRINT '錯誤! 重複索引鍵!'
        ELSE
            PRINT '錯誤! 未知錯誤發生!'
        RETURN @errorNo
    END
END
```

### 呼叫範例

```sql
DECLARE @retVar int
EXEC @retVar = 新增課程 'CS222', '資料庫式設計', 3
PRINT '傳回代碼:' + CONVERT(varchar, @retVar)
```

---

##  使用 OUTPUT 關鍵字

### 語法

```sql
@參數1 資料類型 [=預設值] [OUTPUT],
@參數2 資料類型 [=預設值] [OUTPUT] [, ...]
```

- 將參數宣告成輸出參數，預存程序執行後可將參數值傳回呼叫者
- 執行時也需指定 `OUTPUT` 關鍵字

### 執行語法

```sql
EXEC[UTE] 預存程序名稱 @傳回值變數 = 參數值 OUTPUT [, ...]
```

### 範例：薪水查詢

```sql
CREATE PROCEDURE 薪水查詢
    @name   varchar(12),
    @salary money OUTPUT
AS
BEGIN
    SELECT @salary = 薪水
    FROM 員工
    WHERE 姓名 = @name
END
```

### 呼叫範例

```sql
DECLARE @mySalary money
EXEC 薪水查詢 '張無忌', @salary = @mySalary OUTPUT
PRINT 'Joe''s 薪水:' + CONVERT(varchar, @mySalary)
```

---

## 修改與刪除預存程序

###  修改預存程序

#### 使用 Management Studio

- **修改內容**：在「物件總管」的預存程序上，右鍵 → 【修改】
- **更改名稱**：右鍵 → 【重新命名】，直接輸入新名稱

#### 使用 T-SQL 指令（ALTER PROCEDURE）

語法與 `CREATE PROCEDURE` 相同，簡單說就是重新定義預存程序。
`ALTER PROCEDURE` 無法更改預存程序名稱，需使用 `sp_rename` 系統預存程序。

```sql
ALTER PROCEDURE 課程資料報表 AS
BEGIN
    SELECT 課程編號, 名稱, 學分
    FROM 課程
    WHERE 學分 > 3
END
GO
EXEC 課程資料報表
```

---

### 刪除預存程序

#### 使用 Management Studio

在「物件總管」展開預存程序 → 右鍵 → 【刪除】→ 【確定】

#### 使用 T-SQL 指令

```sql
DROP PROC[EDURE] 預存程序名稱
-- 如果不只一個，請使用「,」逗號分隔
```

```sql
-- 範例
DROP PROCEDURE 課程資料報表
```

---

## 系統預存程序（System Stored Procedures）

系統預存程序與擴充預存程序（Extended Stored Procedures）是 SQL Server 已經預設寫好的預存程序，主要目的是擴充 T-SQL 語言的功能。即使用 `sp_` 開頭的預存程序。

### 常用系統與擴充預存程序

| 系統與擴充預存程序 | 說明 |
|---|---|
| `sp_help [名稱]` | 傳回參數指定的資料庫物件、使用者自訂資料類型或 SQL Server 內建資料類型的資訊，如果沒有參數就是傳回所有物件的資訊 |
| `sp_helptext 名稱` | 傳回參數預存程序、自訂函數、觸發程序或檢視表的內容 |
| `sp_helpdb [資料庫名稱]` | 傳回參數資料庫的資訊，如果沒有參數就是傳回所有資料庫的摘要資訊 |
| `sp_columns 資料表名稱` | 傳回指定資料表或檢視表的欄位資訊 |
| `sp_who [登入帳戶]` | 提供 SQL Server 執行個體中關於目前使用者、工作階段和處理序的資訊 |
| `sp_droplogin 登入帳戶` | 刪除指定的登入帳戶 |
| `xp_cmdshell` | 執行 Windows 作業系統的命令 |
| `xp_msver` | 傳回 SQL Server 版本資訊 |
| `xp_logininfo` | 傳回 Windows 使用者和群組的資訊 |

### 範例

```sql
-- 顯示預存程序內容
EXEC sp_helptext 課程查詢

-- 顯示資料表欄位資訊
EXEC sp_columns 學生
```

---

## 順序物件（Sequence）

SQL Server 的順序物件是一個資料庫物件，可以根據建立順序時指定的開始值、增量和結束值來產生數值序列，即流水號。

- 順序物件的數值序列會以定義的間隔，依照遞增或遞減的順序來產生
- 當編號用完時，可以重新啟動（循環產生下一個數值）
- 與資料表識別欄位（自動編號）的差異：**順序物件和資料表之間沒有任何關聯**，是一個獨立物件
- 優點：不受限於單一資料表，可以共用同一個順序物件替不同資料表的不同欄位產生流水號

### 建立順序物件

#### 使用 Management Studio

在「物件總管」展開資料庫 → 【可程式性】→ 【順序】→ 右鍵 → 【新增順序】，輸入名稱、資料類型、開始值、遞增量，可指定最小值、最大值和是否循環，按【確定】建立。

#### 使用 T-SQL 指令（CREATE SEQUENCE）

```sql
CREATE SEQUENCE 順序名稱 [ AS 資料類型 ]
    [ START WITH 常數值 ]
    [ INCREMENT BY 常數值 ]
    [ MINVALUE [ 頻數值 ] | NO MINVALUE ]
    [ MAXVALUE [ 常數值 ] | NO MAXVALUE ]
    [ CYCLE | NO CYCLE ]
    [ CACHE [ 常數值 ] | { NO CACHE } ]
```

#### CREATE SEQUENCE 子句說明

| 子句 | 說明 |
|---|---|
| `START WITH` | 順序物件傳回的第 1 個值，遞增順序物件的最小值；遞減順序物件的最大值 |
| `INCREMENT BY` | 每次呼叫 `NEXT VALUE FOR` 時遞增的增量值，負數是遞減，增量不能為 0，預設值是 1 |
| `MINVALUE \| NO MINVALUE` | 指定順序物件的最小值，沒有指定就是資料類型的最小值 |
| `MAXVALUE \| NO MAXVALUE` | 指定順序物件的最大值，沒有指定就是資料類型的最大值 |
| `CYCLE \| NO CYCLE` | 指定當超出範圍是否重新啟動，再循環產生下一個值 |
| `CACHE \| NO CACHE` | 指定快取尺寸來提升效能 |

> AS 關鍵字後是使用的資料類型，可以使用 `tinyint`、`smallint`、`int`、`bigint`（預設值）、`decimal` 和 `numeric`（小數位數為 0）資料類型。

#### 範例

```sql
CREATE SEQUENCE 編號順序 AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
```

---

### 使用順序物件（NEXT VALUE FOR）

```sql
NEXT VALUE FOR 順序物件名稱
```

```sql
-- 取得整數順序的下一個值
SELECT NEXT VALUE FOR 整數順序 AS 整數順序
```

### IDENTITY_INSERT（允許插入識別欄位）

資料表欄位也可以使用順序物件產生值，需要使用 `IDENTITY_INSERT` 選項允許將明確值插入資料表的識別欄位。

```sql
SET IDENTITY_INSERT 資料表名稱 ON | OFF
-- ON：允許將明確值插入識別欄位
-- OFF：不允許
-- 同一時間 SQL Server 只允許一個資料表為 ON，插入記錄後記得切換成 OFF
```

#### 範例（跨資料表使用同一順序物件產生流水號）

```sql
SET IDENTITY_INSERT 好客戶 ON
GO
INSERT INTO 好客戶 (客戶編號, 身份證字號, 姓名)
VALUES (NEXT VALUE FOR 編號順序, 'A333333333', '王大安')
GO
SET IDENTITY_INSERT 好客戶 OFF
GO
SET IDENTITY_INSERT 好員工 ON
GO
INSERT INTO 好員工 (員工編號, 姓名)
VALUES (NEXT VALUE FOR 編號順序, '王允傑')
GO
INSERT INTO 好員工 (員工編號, 姓名)
VALUES (NEXT VALUE FOR 編號順序, '陳允傑')
GO
SET IDENTITY_INSERT 好員工 OFF
GO
SELECT * FROM 好客戶
GO
SELECT * FROM 好員工
```

---

### 修改與刪除順序物件

```sql
-- 修改
ALTER SEQUENCE 順序物件名稱 ...

-- 刪除
DROP SEQUENCE 順序物件名稱
```

---

### 修改順序物件（ALTER SEQUENCE）

```sql
ALTER SEQUENCE 順序名稱
    [ RESTART WITH 常數值 ]
    [ INCREMENT BY 常數值 ]
    [ MINVALUE [ 頻數值 ] | NO MINVALUE ]
    [ MAXVALUE [ 常數值 ] | NO MAXVALUE ]
    [ CYCLE | NO CYCLE ]
    [ CACHE [ 常數值 ] | { NO CACHE } ]
```

- 子句和 `CREATE SEQUENCE` 相似，除了第 1 個是 `RESTART WITH`，可以指定順序物件傳回的下一個值
- `ALTER SEQUENCE` 不能變更資料類型，如需變更請刪除後重新建立

```sql
-- 範例：起始值改為 50，增量改為 2
ALTER SEQUENCE 編號順序
    RESTART WITH 50
    INCREMENT BY 2
```

---

### 刪除順序物件（DROP SEQUENCE）

```sql
DROP SEQUENCE 順序物件名稱
-- 如果有多個，請使用「,」號分隔
```

```sql
-- 範例
DROP SEQUENCE 編號順序
```