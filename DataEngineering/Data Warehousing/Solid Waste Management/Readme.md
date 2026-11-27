
# Sales Data Warehouse & Advanced SQL Analytics

## 📌 Project Overview

This project focuses on designing and implementing a Sales Data Warehouse using PostgreSQL to support business intelligence and analytical reporting.

The data warehouse organizes sales information using fact and dimension tables, enabling multidimensional analysis of sales performance across different countries, product categories, and time periods.

The project also demonstrates advanced SQL aggregation techniques and precomputed reporting using Materialized Views.

## 🛠️ Technologies & Concepts

- **Database:** PostgreSQL
- **Query Language:** SQL
- **Data Warehousing:** Fact Tables and Dimension Tables
- **Dimensional Modeling:** Star Schema
- **Advanced SQL:** GROUPING SETS, ROLLUP, CUBE
- **Query Optimization Concepts:** Materialized Views
- **Analytics:** Business Intelligence and Sales Reporting

## 🏗️ Data Warehouse Design

The data warehouse consists of four tables:

### Dimension Tables

1. **DimDate:** Stores date-related information such as year, quarter, month, and weekday.
2. **DimCountry:** Stores country information.
3. **DimCategory:** Stores product category information.

### Fact Table

4. **FactSales:** Stores sales transactions, including order ID, date ID, country ID, category ID, and sales amount.

## 📊 Project Implementation

### 1. Database Design and Implementation

- Designed the data warehouse structure using fact and dimension tables.
- Implemented database tables and relationships using PostgreSQL.
- Organized sales data to support multidimensional analysis.

### 2. Data Loading

- Imported dataset records into the dimension and fact tables.
- Loaded dimension data before fact data to maintain referential integrity.
- Validated data loading through SQL queries.

### 3. Analytical SQL Queries

Developed SQL queries to answer business questions such as:

- What is the total sales amount?
- What are the total sales by country?
- What are the total sales by product category?
- What are the yearly, quarterly, and monthly sales?
- Which country generates the highest sales?
- Which product category generates the highest sales?
- What is the country-wise and category-wise sales performance?

### 4. Advanced SQL Aggregations

Implemented advanced SQL aggregation techniques:

- **GROUPING SETS:** Generated multiple aggregation levels for country-wise, category-wise, and country-category sales analysis.
- **ROLLUP:** Generated hierarchical sales summaries using year and country.
- **CUBE:** Analyzed average sales across different combinations of year and country.

### 5. Materialized View

Created a materialized view named `total_sales_per_country` to store precomputed country-wise total sales.

This demonstrates the concept of precomputed aggregations for analytical reporting.

## 💡 Key Skills Demonstrated

- PostgreSQL Database Management
- SQL Query Development
- Data Warehouse Design
- Dimensional Modeling
- Fact and Dimension Tables
- Data Loading and Validation
- GROUPING SETS
- ROLLUP and CUBE
- Materialized Views
- Business Intelligence
- Analytical Reporting

## 📁 Repository Structure

```text
Sales-Data-Warehouse/
│
├── Database/
│   ├── schema.sql
│   └── data-loading.sql
│
├── SQL-Reports/
│   └── analytical-queries.sql
│
├── Documentation/
│   └── data-warehouse-design.pdf
│
└── README.md
```

## 📈 Project Outcome

Successfully designed and implemented a PostgreSQL-based Sales Data Warehouse and developed analytical SQL reports using basic and advanced aggregation techniques.

The project demonstrates the use of dimensional modeling, multidimensional sales analysis, and precomputed reporting structures to support business decision-making.

## 📚 Learning Outcomes

- Understanding data warehouse architecture.
- Implementing fact and dimension tables.
- Writing SQL queries involving multiple table joins.
- Performing time-based and multidimensional analysis.
- Applying advanced SQL aggregation techniques.
- Understanding precomputed reporting and materialized views.

---

**Project Category:** Data Warehousing & Business Intelligence

**Database:** PostgreSQL
