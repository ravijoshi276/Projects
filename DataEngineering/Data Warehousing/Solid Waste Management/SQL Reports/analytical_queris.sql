--A Grouping sets query
--Country,Category,totalsales
SELECT c.country,ca.category,sum(t.amount) as totalsales
From(Select countryid,categoryid,amount
FROM "FactSales") t Natural Join "DimCountry" c Natural Join "DimCategory" ca
Group by Grouping sets (
(c.country,ca.category),
(c.country),
(ca.category),
()
);

--Roll Up query
--year,country,totalsales
SELECT d.Year,c.country,sum(t.amount) as totalsales
From(Select countryid,dateid,amount
FROM "FactSales") t Natural Join "DimCountry" c Natural Join "DimDate" d
Group by rollup (d.Year,c.country);

--Cube query
--Year,county,averagesales
SELECT d.Year,c.country,avg(t.amount) as averagesales
From(Select countryid,dateid,amount
FROM "FactSales" )t Natural Join "DimCountry" c Natural Join "DimDate" d
Group by cube (d.Year,c.country);

--MQT with data salest_per_country
CREATE MATERIALIZED VIEW total_sales_per_country AS (
SELECT c.country,sum(t.amount) as totalsales
From(Select countryid,amount
FROM "FactSales" )t Natural Join "DimCountry" c
GROUP BY c.country)
WITH DATA;

