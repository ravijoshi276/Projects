
-- =============================================
-- SOLID WASTE MANAGEMENT DATA WAREHOUSE
-- DATA LOADING SCRIPT
-- Database: PostgreSQL
-- =============================================

-- STEP 1: LOAD CATEGORY DIMENSION

\copy public."DimCategory" (categoryid, category) FROM 'Datasets/DimCategory.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER ',');


-- STEP 2: LOAD COUNTRY DIMENSION

\copy public."DimCountry" (countryid, country) FROM 'Datasets/DimCountry.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER ',');


-- STEP 3: LOAD DATE DIMENSION

\copy public."DimDate" (dateid, date, year, quarter, quartername, month, monthname, day, weekday, weekdayname) FROM 'Datasets/DimDate.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER ',');


-- STEP 4: LOAD FACT TABLE

\copy public."FactSales" (orderid, dateid, countryid, categoryid, amount) FROM 'Datasets/FactSales.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER ',');


-- =============================================
-- STEP 5: VERIFY DATA LOADING
-- =============================================

SELECT COUNT(*) AS total_category_records
FROM public."DimCategory";

SELECT COUNT(*) AS total_country_records
FROM public."DimCountry";

SELECT COUNT(*) AS total_date_records
FROM public."DimDate";

SELECT COUNT(*) AS total_sales_records
FROM public."FactSales";


-- =============================================
-- STEP 6: CHECK SAMPLE RECORDS
-- =============================================

SELECT * FROM public."DimCategory" LIMIT 10;

SELECT * FROM public."DimCountry" LIMIT 10;

SELECT * FROM public."DimDate" LIMIT 10;

SELECT * FROM public."FactSales" LIMIT 10;


-- =============================================
-- STEP 7: CHECK TOTAL SALES AMOUNT
-- =============================================

SELECT SUM(amount) AS total_sales
FROM public."FactSales";
