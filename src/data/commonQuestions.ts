import type { InterviewQuestion } from '../types/resume';

export interface CommonQuestionItem extends InterviewQuestion {
  codeSnippet?: string;
  queryExample?: string;
}

export const COMMON_QUESTIONS_DATA: CommonQuestionItem[] = [
  // ==========================================
  // 1. SQL & DATABASE QUERIES (20 Questions)
  // ==========================================
  {
    id: 'sql-1',
    question: "Write a SQL query to find the 2nd highest salary from an Employee table without using the LIMIT clause.",
    answer: "You can find the 2nd highest salary using a subquery with MAX(), or using the `DENSE_RANK()` window function which properly handles duplicate salary ties.\n\nMethod 1 (Subquery with MAX):\nSELECT MAX(salary) AS SecondHighestSalary \nFROM Employee \nWHERE salary < (SELECT MAX(salary) FROM Employee);\n\nMethod 2 (Using DENSE_RANK() window function - Recommended for Nth highest):\nWITH RankedSalaries AS (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_num\n  FROM Employee\n)\nSELECT salary AS SecondHighestSalary\nFROM RankedSalaries\nWHERE rank_num = 2;",
    queryExample: `SELECT MAX(salary) AS SecondHighestSalary 
FROM Employee 
WHERE salary < (SELECT MAX(salary) FROM Employee);`,
    keyTalkingPoints: [
      "Subquery with MAX(salary) finds highest value strictly less than overall max",
      "DENSE_RANK() handles duplicate salary ties better than ROW_NUMBER()",
      "Index on salary column optimizes sorting time complexity to O(log N)"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: 2nd Highest Salary"
  },
  {
    id: 'sql-2',
    question: "Write a SQL query to find all duplicate emails in a Users table, and write a query to delete duplicates while keeping the row with the smallest ID.",
    answer: "1. Finding duplicate emails:\nSELECT email, COUNT(*) AS count\nFROM Users\nGROUP BY email\nHAVING COUNT(*) > 1;\n\n2. Deleting duplicates while keeping smallest ID:\nDELETE u1 FROM Users u1\nINNER JOIN Users u2 \nON u1.email = u2.email AND u1.id > u2.id;\n\nAlternative using CTE and ROW_NUMBER():\nWITH RankedEmails AS (\n  SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id ASC) as rn\n  FROM Users\n)\nDELETE FROM Users \nWHERE id IN (SELECT id FROM RankedEmails WHERE rn > 1);",
    queryExample: `DELETE u1 FROM Users u1
INNER JOIN Users u2 
ON u1.email = u2.email AND u1.id > u2.id;`,
    keyTalkingPoints: [
      "GROUP BY ... HAVING COUNT(*) > 1 identifies duplicate keys",
      "Self-join on u1.email = u2.email AND u1.id > u2.id deletes higher duplicate IDs",
      "Window function ROW_NUMBER() partitioned by email provides clean deduplication"
    ],
    category: "SQL & Database Queries",
    difficulty: "Medium",
    contextTag: "SQL: Duplicate Records"
  },
  {
    id: 'sql-3',
    question: "Write a SQL query to calculate the 7-day rolling average revenue for each transaction date from a DailySales table.",
    answer: "You can calculate rolling aggregates in SQL using Window Functions with the `ROWS BETWEEN` clause:\n\nSELECT \n  sale_date,\n  daily_revenue,\n  AVG(daily_revenue) OVER (\n    ORDER BY sale_date \n    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) AS rolling_7_day_avg_revenue\nFROM DailySales\nORDER BY sale_date;",
    queryExample: `SELECT 
  sale_date,
  daily_revenue,
  AVG(daily_revenue) OVER (
    ORDER BY sale_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7_day_avg_revenue
FROM DailySales;`,
    keyTalkingPoints: [
      "`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` defines 7-row sliding window",
      "Use `RANGE BETWEEN INTERVAL 6 DAY PRECEDING AND CURRENT ROW` if dates have missing gap rows",
      "Requires index on sale_date for fast sequential aggregation"
    ],
    category: "SQL & Database Queries",
    difficulty: "Hard",
    contextTag: "SQL: Window Rolling Averages"
  },
  {
    id: 'sql-4',
    question: "Write a SQL query to find the top 3 highest-earning employees in each department from Employee and Department tables.",
    answer: "Using `DENSE_RANK()` partitioned by department_id:\n\nWITH RankedDeptSalaries AS (\n  SELECT \n    d.name AS department,\n    e.name AS employee,\n    e.salary,\n    DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS salary_rank\n  FROM Employee e\n  INNER JOIN Department d ON e.department_id = d.id\n)\nSELECT department, employee, salary\nFROM RankedDeptSalaries\nWHERE salary_rank <= 3\nORDER BY department, salary DESC;",
    queryExample: `WITH RankedDeptSalaries AS (
  SELECT 
    d.name AS department,
    e.name AS employee,
    e.salary,
    DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS salary_rank
  FROM Employee e
  INNER JOIN Department d ON e.department_id = d.id
)
SELECT department, employee, salary
FROM RankedDeptSalaries
WHERE salary_rank <= 3;`,
    keyTalkingPoints: [
      "`PARTITION BY e.department_id` resets ranking counter per department",
      "DENSE_RANK() handles salary ties without skipping ranking numbers",
      "Composite index on `(department_id, salary DESC)` optimizes query performance"
    ],
    category: "SQL & Database Queries",
    difficulty: "Medium",
    contextTag: "SQL: Top N Per Group"
  },
  {
    id: 'sql-5',
    question: "Write a query to find customers who have never placed an order using LEFT JOIN, NOT EXISTS, and NOT IN. Which approach performs best?",
    answer: "Approach 1 (NOT EXISTS - Generally Best Performance):\nSELECT c.id, c.name \nFROM Customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM Orders o WHERE o.customer_id = c.id\n);\n\nApproach 2 (LEFT JOIN with IS NULL check):\nSELECT c.id, c.name\nFROM Customers c\nLEFT JOIN Orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;\n\nApproach 3 (NOT IN - Vulnerable to NULLs):\nSELECT c.id, c.name\nFROM Customers c\nWHERE c.id NOT IN (SELECT customer_id FROM Orders WHERE customer_id IS NOT NULL);\n\nPerformance Verdict: `NOT EXISTS` and `LEFT JOIN ... IS NULL` are optimized into Anti-Joins by modern query optimizers. `NOT IN` fails completely if any subquery row contains a NULL value.",
    queryExample: `SELECT c.id, c.name 
FROM Customers c
WHERE NOT EXISTS (
  SELECT 1 FROM Orders o WHERE o.customer_id = c.id
);`,
    keyTalkingPoints: [
      "NOT EXISTS executes as an Anti-Join and short-circuits on first match",
      "NOT IN returns zero rows if any subquery result contains a NULL value",
      "Ensure foreign key `customer_id` is indexed in Orders table"
    ],
    category: "SQL & Database Queries",
    difficulty: "Medium",
    contextTag: "SQL: Anti-Joins & NOT EXISTS"
  },
  {
    id: 'sql-6',
    question: "Write a SQL query to find all numbers that appear at least three consecutive times in a Logs table with columns (id, num).",
    answer: "Method using `LEAD()` and `LAG()` Window Functions:\n\nWITH ConsecutiveLogs AS (\n  SELECT \n    num,\n    LAG(num, 1) OVER (ORDER BY id) AS prev_num,\n    LEAD(num, 1) OVER (ORDER BY id) AS next_num\n  FROM Logs\n)\nSELECT DISTINCT num AS ConsecutiveNums\nFROM ConsecutiveLogs\nWHERE num = prev_num AND num = next_num;",
    queryExample: `SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l1.id = l2.id - 1 AND l1.num = l2.num
JOIN Logs l3 ON l1.id = l3.id - 2 AND l1.num = l3.num;`,
    keyTalkingPoints: [
      "LEAD/LAG window functions inspect adjacent rows cleanly",
      "Self-join on id = id + 1 is an alternative when IDs are strictly sequential",
      "DISTINCT prevents duplicate reportings if a number appears 4+ consecutive times"
    ],
    category: "SQL & Database Queries",
    difficulty: "Medium",
    contextTag: "SQL: Consecutive Values"
  },
  {
    id: 'sql-7',
    question: "Explain the visual differences and execution rules between INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, and CROSS JOIN.",
    answer: "1. INNER JOIN: Returns only rows where the join predicate matches in BOTH left and right tables.\n2. LEFT (OUTER) JOIN: Returns all rows from left table; unmatched right table columns are filled with NULLs.\n3. RIGHT (OUTER) JOIN: Returns all rows from right table; unmatched left table columns are filled with NULLs.\n4. FULL (OUTER) JOIN: Returns all rows when there is a match in either left or right table; unmatched sides are NULL.\n5. CROSS JOIN: Computes the Cartesian Product (every row in table A matched with every row in table B: total rows = M * N).",
    keyTalkingPoints: [
      "INNER JOIN: Intersection of both tables",
      "LEFT JOIN: All left rows + matching right rows (NULLs for unmatched)",
      "CROSS JOIN: Cartesian product (M * N rows)"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: Join Types"
  },
  {
    id: 'sql-8',
    question: "Write a SQL query to calculate Month-over-Month (MoM) user growth rate percentage from a MonthlyActiveUsers table.",
    answer: "Using `LAG()` window function:\n\nWITH MonthlyMetrics AS (\n  SELECT \n    month_date,\n    active_users,\n    LAG(active_users, 1) OVER (ORDER BY month_date) AS prev_month_users\n  FROM MonthlyActiveUsers\n)\nSELECT \n  month_date,\n  active_users,\n  prev_month_users,\n  ROUND(\n    ((active_users - prev_month_users)::numeric / NULLIF(prev_month_users, 0)) * 100.0, \n    2\n  ) AS mom_growth_percentage\nFROM MonthlyMetrics;",
    queryExample: `SELECT 
  month_date,
  active_users,
  ROUND(((active_users - LAG(active_users) OVER (ORDER BY month_date))::numeric / NULLIF(LAG(active_users) OVER (ORDER BY month_date), 0)) * 100, 2) AS mom_growth_pct
FROM MonthlyActiveUsers;`,
    keyTalkingPoints: [
      "LAG(active_users, 1) retrieves previous month's metric",
      "NULLIF(prev_month_users, 0) prevents division by zero runtime exceptions",
      "MoM formula: ((Current - Previous) / Previous) * 100"
    ],
    category: "SQL & Database Queries",
    difficulty: "Hard",
    contextTag: "SQL: MoM Growth Calculation"
  },
  {
    id: 'sql-9',
    question: "Write a SQL query to pivot rows into columns (convert monthly sales rows into columns: Jan, Feb, Mar) using standard ANSI SQL without proprietary PIVOT keywords.",
    answer: "Use conditional aggregation with `CASE WHEN` and `SUM()`:\n\nSELECT \n  product_id,\n  SUM(CASE WHEN sale_month = 'Jan' THEN revenue ELSE 0 END) AS Jan_Revenue,\n  SUM(CASE WHEN sale_month = 'Feb' THEN revenue ELSE 0 END) AS Feb_Revenue,\n  SUM(CASE WHEN sale_month = 'Mar' THEN revenue ELSE 0 END) AS Mar_Revenue,\n  SUM(revenue) AS Total_Q1_Revenue\nFROM ProductSales\nGROUP BY product_id;",
    queryExample: `SELECT 
  product_id,
  SUM(CASE WHEN sale_month = 'Jan' THEN revenue ELSE 0 END) AS Jan_Rev,
  SUM(CASE WHEN sale_month = 'Feb' THEN revenue ELSE 0 END) AS Feb_Rev,
  SUM(CASE WHEN sale_month = 'Mar' THEN revenue ELSE 0 END) AS Mar_Rev
FROM ProductSales
GROUP BY product_id;`,
    keyTalkingPoints: [
      "Conditional aggregation (`SUM(CASE WHEN ... THEN ... ELSE 0 END)`) works across all SQL dialects",
      "`GROUP BY` consolidates pivoted columns per entity",
      "Faster and more portable than dynamic proprietary PIVOT keywords"
    ],
    category: "SQL & Database Queries",
    difficulty: "Medium",
    contextTag: "SQL: Conditional Aggregation & Pivot"
  },
  {
    id: 'sql-10',
    question: "Write a SQL query to find all employees who earn more than their direct managers from an Employee table (id, name, salary, manager_id).",
    answer: "Using a Self-Join:\n\nSELECT \n  e.name AS Employee,\n  e.salary AS EmpSalary,\n  m.name AS Manager,\n  m.salary AS ManagerSalary\nFROM Employee e\nINNER JOIN Employee m \n  ON e.manager_id = m.id\nWHERE e.salary > m.salary;",
    queryExample: `SELECT e.name AS Employee
FROM Employee e
INNER JOIN Employee m ON e.manager_id = m.id
WHERE e.salary > m.salary;`,
    keyTalkingPoints: [
      "Self-join joins table against itself using alias e (employee) and m (manager)",
      "`ON e.manager_id = m.id` creates the hierarchical parent-child relation",
      "`WHERE e.salary > m.salary` filters required condition"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: Self-Join Manager Hierarchy"
  },
  {
    id: 'sql-11',
    question: "Write a SQL query to solve the classic 'Gaps and Islands' problem: find all continuous consecutive active date streaks / intervals for users.",
    answer: "The 'Gaps and Islands' problem identifies contiguous ranges of consecutive sequence numbers or dates.\n\nSolution using `ROW_NUMBER()` difference technique:\nSubtracting a dense row number from the date produces a constant grouping date identifier for all rows in the same consecutive island!\n\nWITH RankedActivity AS (\n  SELECT \n    user_id,\n    activity_date,\n    activity_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY activity_date) * INTERVAL '1 day') AS island_group\n  FROM UserActivity\n)\nSELECT \n  user_id,\n  MIN(activity_date) AS streak_start_date,\n  MAX(activity_date) AS streak_end_date,\n  COUNT(*) AS streak_length_days\nFROM RankedActivity\nGROUP BY user_id, island_group\nHAVING COUNT(*) >= 2\nORDER BY user_id, streak_start_date;",
    queryExample: `WITH RankedActivity AS (
  SELECT 
    user_id,
    activity_date,
    activity_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY activity_date) * INTERVAL '1 day') AS island_group
  FROM UserActivity
)
SELECT 
  user_id,
  MIN(activity_date) AS streak_start_date,
  MAX(activity_date) AS streak_end_date,
  COUNT(*) AS streak_length_days
FROM RankedActivity
GROUP BY user_id, island_group
ORDER BY user_id, streak_start_date;`,
    keyTalkingPoints: [
      "Subtracting sequential ROW_NUMBER() from consecutive dates yields a constant island identifier",
      "GROUP BY user_id, island_group consolidates the start date, end date, and streak count",
      "Standard interview benchmark query testing advanced SQL window mastery"
    ],
    category: "SQL & Database Queries",
    difficulty: "Hard",
    contextTag: "SQL: Gaps and Islands Streak Query"
  },
  {
    id: 'sql-12',
    question: "What is the difference between WHERE and HAVING clauses in SQL? Give an example demonstrating both in a single query.",
    answer: "1. WHERE Clause:\n- Filters individual rows BEFORE any grouping or aggregation takes place.\n- Cannot be used with aggregate functions (e.g. `WHERE COUNT(*) > 5` is invalid).\n\n2. HAVING Clause:\n- Filters groups AFTER `GROUP BY` aggregation has computed summary values.\n- Works directly with aggregate functions (`HAVING SUM(salary) > 50000`).\n\nExample Query combining both:\nSELECT department_id, AVG(salary) AS avg_sal\nFROM Employee\nWHERE status = 'Active'        -- Row filter (before grouping)\nGROUP BY department_id\nHAVING AVG(salary) > 75000;    -- Group filter (after aggregation)",
    queryExample: `SELECT department_id, AVG(salary) AS avg_sal
FROM Employee
WHERE status = 'Active'
GROUP BY department_id
HAVING AVG(salary) > 75000;`,
    keyTalkingPoints: [
      "WHERE filters individual rows BEFORE aggregation",
      "HAVING filters aggregated groups AFTER GROUP BY execution",
      "Aggregate functions (SUM, AVG, COUNT) can only be used in HAVING"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: WHERE vs HAVING"
  },
  {
    id: 'sql-13',
    question: "Explain the differences between DELETE, TRUNCATE, and DROP commands in SQL.",
    answer: "1. DELETE (DML - Data Manipulation Language):\n- Deletes specific rows matching a `WHERE` condition (or all rows if no WHERE is given).\n- Row-by-row deletion recorded in transaction logs; can be rolled back inside a transaction.\n- Retains table structure, indexes, and triggers. Fires `DELETE` triggers.\n\n2. TRUNCATE (DDL - Data Definition Language):\n- Removes ALL rows from a table by deallocating data pages.\n- Faster than DELETE because it does not log individual row deletions.\n- Resets identity / AUTO_INCREMENT counters. Cannot be used with WHERE clause. Does not fire triggers.\n\n3. DROP (DDL - Data Definition Language):\n- Completely destroys the table structure, data, indexes, permissions, and constraints from the database catalog.",
    keyTalkingPoints: [
      "DELETE is DML (logged row-by-row, supports WHERE, can roll back, fires triggers)",
      "TRUNCATE is DDL (fast page deallocation, removes all rows, resets AUTO_INCREMENT)",
      "DROP is DDL (removes entire table schema and data permanently)"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: DELETE vs TRUNCATE vs DROP"
  },
  {
    id: 'sql-14',
    question: "Write a SQL query to find all employees who joined in the last 30 days using date functions.",
    answer: "In MySQL:\nSELECT * FROM Employee\nWHERE joining_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);\n\nIn PostgreSQL:\nSELECT * FROM Employee\nWHERE joining_date >= CURRENT_DATE - INTERVAL '30 days';\n\nIn SQL Server (T-SQL):\nSELECT * FROM Employee\nWHERE joining_date >= DATEADD(day, -30, GETDATE());",
    queryExample: `SELECT * FROM Employee
WHERE joining_date >= CURRENT_DATE - INTERVAL '30 days';`,
    keyTalkingPoints: [
      "Use `CURRENT_DATE` or `CURDATE()` for today's date",
      "Use date arithmetic (`DATE_SUB` / `DATEADD` / `INTERVAL '30 days'`)",
      "Indexing `joining_date` allows range index scan"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: Date Filtering Functions"
  },
  {
    id: 'sql-15',
    question: "What is the difference between UNION and UNION ALL in SQL? Which is faster and why?",
    answer: "1. UNION:\n- Combines the result sets of two or more SELECT queries and automatically removes duplicate rows.\n- Performance: Slower because it performs an internal sort and deduplication operation on the combined dataset.\n\n2. UNION ALL:\n- Combines result sets and retains ALL rows, including duplicates.\n- Performance: Significantly faster because it simply concatenates result sets without sorting or deduplication.\n\nRequirement: Both queries must have the same number of columns with compatible data types in the same order.",
    queryExample: `SELECT city FROM Customers
UNION ALL
SELECT city FROM Suppliers;`,
    keyTalkingPoints: [
      "UNION removes duplicates by sorting/hashing the dataset",
      "UNION ALL keeps all records (faster execution, zero deduplication overhead)",
      "Both require identical column count and matching data types"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: UNION vs UNION ALL"
  },
  {
    id: 'sql-16',
    question: "Write a SQL query to display each department name and the total number of employees in that department, including departments with zero employees.",
    answer: "Using `LEFT JOIN` and `COUNT(e.id)`:\n\nSELECT \n  d.name AS DepartmentName,\n  COUNT(e.id) AS TotalEmployees\nFROM Department d\nLEFT JOIN Employee e ON d.id = e.department_id\nGROUP BY d.id, d.name\nORDER BY TotalEmployees DESC;\n\nCrucial Note: Use `COUNT(e.id)` instead of `COUNT(*)` because `COUNT(*)` would count the single NULL row from the LEFT JOIN as 1 for empty departments, whereas `COUNT(e.id)` correctly returns 0.",
    queryExample: `SELECT 
  d.name AS DepartmentName,
  COUNT(e.id) AS TotalEmployees
FROM Department d
LEFT JOIN Employee e ON d.id = e.department_id
GROUP BY d.id, d.name;`,
    keyTalkingPoints: [
      "LEFT JOIN ensures departments with 0 employees are retained in output",
      "Use `COUNT(e.id)` instead of `COUNT(*)` to return 0 for NULLs",
      "GROUP BY department ID and Name"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: Aggregation with LEFT JOIN"
  },
  {
    id: 'sql-17',
    question: "How does the LIKE operator work with wildcards (% and _) in SQL? Give examples for prefix, suffix, and single-character matches.",
    answer: "The `LIKE` operator performs pattern matching in string columns:\n- `%` (Percent Wildcard): Matches zero, one, or multiple characters.\n- `_` (Underscore Wildcard): Matches exactly ONE single character.\n\nExamples:\n1. Names starting with 'A': `WHERE name LIKE 'A%'`\n2. Names ending with 'son': `WHERE name LIKE '%son'`\n3. Names containing 'vi': `WHERE name LIKE '%vi%'`\n4. Exactly 4-letter names starting with 'J': `WHERE name LIKE 'J___'`\n5. Second letter is 'a': `WHERE name LIKE '_a%'`",
    queryExample: `SELECT * FROM Customers WHERE name LIKE 'A%';`,
    keyTalkingPoints: [
      "`%` matches any string of zero or more characters",
      "`_` matches exactly one character",
      "Leading wildcards (e.g. `LIKE '%abc'`) cannot use B-Tree indexes (causes full table scan)"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: LIKE Operator & Wildcards"
  },
  {
    id: 'sql-18',
    question: "What is the difference between Primary Key and Unique Key constraints in SQL?",
    answer: "1. Primary Key:\n- Uniquely identifies each row in a table.\n- Strictly cannot accept `NULL` values (`NOT NULL` is enforced).\n- Only ONE Primary Key is allowed per table.\n- Automatically creates a Clustered Index in MySQL (InnoDB) and SQL Server.\n\n2. Unique Key:\n- Enforces uniqueness across columns to prevent duplicate entries.\n- Allows `NULL` values (standard SQL allows multiple NULLs; SQL Server allows one NULL).\n- A table can have MULTIPLE Unique Key constraints.\n- By default creates a Non-Clustered (Secondary) Index.",
    keyTalkingPoints: [
      "Primary Key does not accept NULL; Unique Key allows NULLs",
      "Only 1 Primary Key per table; Multiple Unique Keys allowed",
      "Primary Key usually forms the clustered index"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: Primary Key vs Unique Key"
  },
  {
    id: 'sql-19',
    question: "How do you handle NULL values in SQL using COALESCE() and IFNULL()? Write a query demonstrating fallback values.",
    answer: "NULL represents missing, unknown, or unavailable data. Comparing with `= NULL` always evaluates to UNKNOWN/False; use `IS NULL` or `IS NOT NULL`.\n\nFallback Functions:\n1. `COALESCE(val1, val2, ..., valN)`: ANSI standard function that returns the first non-NULL expression in the argument list.\n2. `IFNULL(val, default_val)`: MySQL-specific function that returns default_val if val is NULL.\n\nExample Query:\nSELECT \n  name,\n  COALESCE(phone, mobile, email, 'No Contact Available') AS primary_contact\nFROM Candidates;",
    queryExample: `SELECT name, COALESCE(phone, 'N/A') AS phone_number FROM Users;`,
    keyTalkingPoints: [
      "NULL cannot be compared with `=` (must use `IS NULL`)",
      "COALESCE() is ANSI SQL standard and evaluates first non-NULL from left to right",
      "IFNULL() / ISNULL() are dialect-specific fallbacks"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: Handling NULLs with COALESCE"
  },
  {
    id: 'sql-20',
    question: "What is a SQL View, and how does a Standard View differ from a Materialized View?",
    answer: "1. Standard View (Virtual Table):\n- A saved SQL query stored in the database catalog. It does NOT store physical data on disk.\n- Every time the view is queried, the database executes the underlying query on the fly.\n- Benefit: Encapsulates complex joins, restricts column visibility for security, uses zero extra disk space.\n\n2. Materialized View (Physical Cache):\n- Executes the query and physically stores the resulting table data on disk.\n- Benefit: Lightning-fast reads for heavy aggregation queries because data is pre-computed.\n- Trade-off: Requires periodic refreshing (`REFRESH MATERIALIZED VIEW`) when underlying base tables change.",
    keyTalkingPoints: [
      "Standard View: Virtual query executed on the fly (0 disk space)",
      "Materialized View: Physically cached query result on disk for high read speed",
      "Materialized Views require refresh schedules to sync with base tables"
    ],
    category: "SQL & Database Queries",
    difficulty: "Easy",
    contextTag: "SQL: Standard View vs Materialized View"
  },

  // ==========================================
  // 2. DATA STRUCTURES (20 Questions)
  // ==========================================
  {
    id: 'ds-1',
    question: "Explain the fundamental differences between an Array and a Singly Linked List in terms of memory layout, CPU cache locality, and operations time complexity.",
    answer: "1. Memory Layout & Cache Locality:\n- Arrays: Allocated in contiguous memory blocks. High CPU cache locality because sequential elements are pre-fetched into L1/L2 cache lines.\n- Linked Lists: Nodes are dynamically allocated on the heap with pointers (`node.next`). Non-contiguous memory leads to frequent CPU cache misses.\n\n2. Time Complexities:\n- Random Access: Array is O(1) via direct address calculation (`base + index * size`). Linked List is O(N) traversal.\n- Insertion/Deletion at Start: Array is O(N) due to shifting elements. Linked List is O(1) pointer updates.\n- Insertion at Arbitrary Position: Array requires O(N) shifts. Linked List requires O(N) traversal to find position, then O(1) pointer insertion.\n\n3. Memory Overhead:\n- Arrays have fixed capacity (or resize doubling cost). Linked lists store pointer metadata per node (8 bytes on 64-bit systems).",
    keyTalkingPoints: [
      "Arrays offer contiguous memory and superior CPU cache locality",
      "Array random lookup is O(1); Linked List requires O(N) pointer chasing",
      "Linked List provides O(1) head insertion/deletion with no memory reallocation"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Array vs Linked List Internals"
  },
  {
    id: 'ds-2',
    question: "How does a Hash Table achieve average O(1) time complexity? Explain Load Factor, Hash Collisions, and compare Separate Chaining with Open Addressing.",
    answer: "A Hash Table maps keys to bucket indices using `index = hash(key) % capacity` in O(1) time.\n\n1. Load Factor (alpha):\n- `alpha = N / capacity`. When load factor exceeds threshold (typically 0.75), the table doubles its capacity and re-hashes all keys to prevent clustering.\n\n2. Collision Resolution Techniques:\n- Separate Chaining: Each bucket holds a linked list or self-balancing Red-Black BST (Java 8+ HashMap converts list to tree when bucket length > 8).\n- Open Addressing (Linear/Quadratic Probing, Double Hashing): Stores all entries in the array. On collision, probes next available slot.",
    keyTalkingPoints: [
      "Hash function maps keys to array index in average O(1)",
      "Separate Chaining uses linked lists/Red-Black trees at each bucket",
      "Load factor (0.75) triggers array resizing and rehashing"
    ],
    category: "Data Structures",
    difficulty: "Medium",
    contextTag: "Hash Table Mechanics & Collisions"
  },
  {
    id: 'ds-3',
    question: "Compare Binary Search Trees (BST), AVL Trees, and Red-Black Trees in terms of balance factors, tree rotations, and worst-case search complexity.",
    answer: "1. Binary Search Tree (BST):\n- Invariant: Left child < Root < Right child.\n- Worst-Case: O(N) height when elements inserted in sorted order.\n\n2. AVL Tree (Strictly Balanced):\n- Invariant: Balance Factor `|Height(Left) - Height(Right)| <= 1`.\n- Height strictly bounded by `1.44 * log2(N)`. Uses single/double rotations (LL, RR, LR, RL).\n- Best for lookup-intensive workloads.\n\n3. Red-Black Tree (Loosely Balanced):\n- Invariant: Root is black, no two consecutive red nodes, all paths contain same number of black nodes.\n- Height bounded by `2 * log2(N+1)`. Requires fewer rotations on insertions/deletions.",
    keyTalkingPoints: [
      "Unbalanced BST degenerates to O(N) linked list on sorted input",
      "AVL Trees enforce strict balance factor <= 1 (faster lookups)",
      "Red-Black trees have lower rotation overhead on writes (used in Java TreeMap, C++ std::map)"
    ],
    category: "Data Structures",
    difficulty: "Hard",
    contextTag: "BST vs AVL vs Red-Black Trees"
  },
  {
    id: 'ds-4',
    question: "Explain the internal structure of a Binary Heap (Min/Max Heap). How is it represented as an array, and how do Heapify, Push, and Pop operations work?",
    answer: "A Binary Heap is a complete binary tree represented compactly as an array with zero pointer overhead:\n- For node at index `i`: Left Child = `2i + 1`, Right Child = `2i + 2`, Parent = `(i - 1) / 2`.\n\nOperations:\n1. Push (Insert): Append element to end of array and `siftUp` (bubble up) by swapping with parent until heap invariant holds: O(log N).\n2. Pop (Extract Min/Max): Swap root with last array element, remove last element, and `siftDown` (bubble down) root: O(log N).\n3. Build Heap (Heapify): Bottom-up siftDown across non-leaf nodes from index `N/2 - 1` down to 0: O(N) time complexity.",
    keyTalkingPoints: [
      "Complete binary tree stored in contiguous array with index formulas (2i+1, 2i+2)",
      "Push and Pop operations run in O(log N) time",
      "Building a heap from raw array (Heapify) runs in O(N) time"
    ],
    category: "Data Structures",
    difficulty: "Medium",
    contextTag: "Binary Heaps & Priority Queues"
  },
  {
    id: 'ds-5',
    question: "What is a Trie (Prefix Tree)? How does it store string characters, and why is it superior to Hash Tables for autocomplete and prefix search?",
    answer: "A Trie is a tree data structure where each node represents a character. A path from root to a marked terminal node forms a complete word.\n\nComplexity: Lookup, Insertion, and Prefix search run in O(L) time where L is string length (independent of number of stored words N).\n\nWhy Superior to Hash Tables for Autocomplete:\n- Hash Table lookup requires hashing the entire query O(L) and cannot find all strings sharing a prefix without scanning all N keys O(N * L).\n- Trie navigates to prefix node in O(L) and traverses sub-tree to return all completions in O(Matches).",
    keyTalkingPoints: [
      "Trie provides deterministic O(L) prefix lookups independent of total words N",
      "Nodes share common prefix paths, saving space for overlapping vocabulary",
      "Essential for Autocomplete, Spell Checkers, and IP Routing tables (Longest Prefix Match)"
    ],
    category: "Data Structures",
    difficulty: "Medium",
    contextTag: "Trie (Prefix Tree) Architecture"
  },
  {
    id: 'ds-6',
    question: "Compare Graph representations: Adjacency Matrix versus Adjacency List in terms of space complexity, edge lookup time, and graph traversal performance.",
    answer: "1. Adjacency Matrix (V x V 2D Array):\n- Space: O(V^2) regardless of edge count.\n- Edge Existence Check (`hasEdge(u, v)`): O(1) direct array lookup.\n- Find all neighbors of vertex u: O(V) scan across row.\n- Ideal for dense graphs (E ≈ V^2).\n\n2. Adjacency List (Array of Linked Lists / Dynamic Arrays):\n- Space: O(V + E) for directed, O(V + 2E) for undirected.\n- Edge Existence Check: O(degree(u)).\n- Find all neighbors: O(degree(u)) direct iteration.\n- Ideal for sparse graphs (E << V^2) and graph traversals (BFS/DFS run in O(V + E)).",
    keyTalkingPoints: [
      "Adjacency Matrix uses O(V^2) space; O(1) edge lookup",
      "Adjacency List uses O(V + E) space; optimal for sparse graphs and BFS/DFS",
      "Most real-world networks (social, web, road) are sparse, favoring Adjacency Lists"
    ],
    category: "Data Structures",
    difficulty: "Medium",
    contextTag: "Graph Representations: Matrix vs List"
  },
  {
    id: 'ds-7',
    question: "What is the difference between a B-Tree and a B+ Tree? Why do relational databases (MySQL, PostgreSQL) use B+ Trees for disk-based indexing?",
    answer: "1. B-Tree: Keys and data pointers are stored in both internal nodes and leaf nodes.\n2. B+ Tree: Internal nodes store ONLY routing search keys; ALL actual data records/pointers are stored exclusively in leaf nodes. Leaf nodes are linked together horizontally as a doubly linked list.\n\nWhy Databases Use B+ Trees:\n- Higher Fan-Out: Because internal nodes store no data pointers, they fit more keys per disk block, keeping tree height very low (3-4 levels for billions of rows).\n- Fast Sequential Range Scans: Queries with `BETWEEN` or `>` traverse to the start leaf node and follow horizontal sibling pointers without backtracking up the tree.",
    keyTalkingPoints: [
      "B+ Trees store data records exclusively in leaf nodes",
      "Higher branching factor (fan-out) minimizes disk I/O seek depth",
      "Doubly linked leaf nodes enable fast sequential range scans"
    ],
    category: "Data Structures",
    difficulty: "Hard",
    contextTag: "B-Tree vs B+ Tree in Databases"
  },
  {
    id: 'ds-8',
    question: "Explain the Disjoint Set Union (DSU / Union-Find) data structure. How do Path Compression and Union by Rank achieve near O(1) amortized time complexity?",
    answer: "DSU manages a partition of a set into disjoint subsets, supporting two operations:\n1. `find(i)`: Determine which subset element i belongs to.\n2. `union(i, j)`: Join two subsets into a single subset.\n\nOptimizations:\n1. Union by Rank/Size: Attach shallower tree under root of deeper tree, keeping tree height O(log N).\n2. Path Compression: During `find(i)`, make every visited node point directly to root.\n\nAmortized Complexity: Combining both optimizations achieves amortized O(alpha(N)) per operation, where alpha is the Inverse Ackermann function (effectively constant <= 4 for all practical universe sizes).",
    keyTalkingPoints: [
      "DSU tracks non-overlapping partitions for cycle detection and Kruskal's MST algorithm",
      "Union by Rank prevents tree imbalance",
      "Path Compression flattens tree during find operations to achieve near O(1) inverse Ackermann time"
    ],
    category: "Data Structures",
    difficulty: "Hard",
    contextTag: "Disjoint Set Union (DSU) & Inverse Ackermann"
  },
  {
    id: 'ds-9',
    question: "What is a Circular Queue? How is it implemented using an array, and how do you handle Queue Full and Queue Empty conditions without pointer ambiguity?",
    answer: "A Circular Queue is a linear data structure following FIFO principle where the last position connects back to the first position like a ring, reusing deallocated array slots.\n\nImplementation:\n- State: `front`, `rear`, `capacity`, `size` (or fixed array with modulo arithmetic).\n- Enqueue: `rear = (rear + 1) % capacity; array[rear] = value; size++`.\n- Dequeue: `val = array[front]; front = (front + 1) % capacity; size--`.\n- Full Condition: `size == capacity` (or `(rear + 1) % capacity == front`).\n- Empty Condition: `size == 0` (or `front == -1` / `front == rear`).",
    keyTalkingPoints: [
      "Avoids memory wastage of standard linear array queues using modulo arithmetic",
      "Enqueue and Dequeue run in O(1) constant time",
      "Used in CPU round-robin scheduling, traffic management, and hardware ring buffers"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Circular Queue Array Implementation"
  },
  {
    id: 'ds-10',
    question: "How does a Doubly Linked List enable O(1) deletion of an arbitrary node when a reference to that node is already provided, compared to Singly Linked List?",
    answer: "In a Singly Linked List, deleting a given node reference requires traversing from head O(N) to find the predecessor node `prev` so that `prev.next = node.next` can be updated.\n\nIn a Doubly Linked List, each node contains pointers to both `prev` and `next`. Deletion is achieved in true O(1) time without any traversal:\n`node.prev.next = node.next;`\n`node.next.prev = node.prev;`\n\nThis O(1) node detachment is the foundational mechanism behind LRU Caches (Hash Map + Doubly Linked List).",
    keyTalkingPoints: [
      "Singly Linked List requires O(N) predecessor search to delete a node",
      "Doubly Linked List has direct `node.prev` reference enabling O(1) detachment",
      "Foundation of LRU (Least Recently Used) cache eviction architecture"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Doubly Linked List O(1) Deletions"
  },
  {
    id: 'ds-11',
    question: "What is a Bloom Filter? Explain its mathematical principles, why it guarantees zero false negatives, and where it is used in databases.",
    answer: "A Bloom Filter is a space-efficient, probabilistic data structure used to test whether an element is a member of a set.\n\nMathematical Mechanics:\n- Structure: A bit array of size `m` initialized to all 0s, paired with `k` independent, uniform cryptographic hash functions.\n- Insertion: To insert element `x`, compute `h_1(x), h_2(x), ..., h_k(x)` and set the bits at those calculated indices to 1.\n- Membership Query: To check if element `y` exists, compute the same `k` hash indices. If ANY of those bits is 0, the element is DEFINITELY NOT in the set (Zero False Negatives). If ALL bits are 1, the element is PROBABLY in the set (Potential False Positive due to bit collisions from other elements).\n\nKey Guarantees:\n- False Negative Rate: 0% (Impossible to miss an element that was inserted).\n- False Positive Rate: Controlled by tuning bit array size `m`, number of items `n`, and hash count `k = (m/n) * ln(2)`.\n- Deletions: Not supported in standard Bloom Filters (setting a bit to 0 might delete other elements; requires Counting Bloom Filter).\n\nReal-World Applications:\n- Database Storage Engines (Cassandra, RocksDB): Checks Bloom filter before reading SSTable files from disk to skip files that do not contain the requested key.\n- Web Caching (Squid, Akamai): Prevents caching one-hit-wonders.",
    keyTalkingPoints: [
      "Probabilistic structure: Guaranteed Zero False Negatives (can have False Positives)",
      "Uses bit array of size m and k independent hash functions",
      "Critical in Cassandra/RocksDB to avoid expensive disk seeks for non-existent keys"
    ],
    category: "Data Structures",
    difficulty: "Hard",
    contextTag: "Data Structures: Bloom Filters"
  },
  {
    id: 'ds-12',
    question: "What is a Stack? Explain the LIFO principle and describe 3 common real-world software applications.",
    answer: "A Stack is a linear data structure that follows the LIFO (Last-In, First-Out) principle: the last element added to the stack is the first element to be removed.\n\nCore Operations:\n- `push(item)`: Adds an element to the top of the stack: O(1).\n- `pop()`: Removes and returns the top element: O(1).\n- `peek()`: Returns the top element without removing it: O(1).\n\n3 Real-World Applications:\n1. Function Call Stack: Used by programming language runtimes (JVM, V8) to track function execution frames, local variables, and return addresses.\n2. Undo/Redo Mechanism: Text editors and design software push actions onto an undo stack.\n3. Expression Evaluation & Syntax Parsing: Compilers use stacks to balance parentheses `{[()]}` and evaluate Postfix/Infix mathematical expressions.",
    keyTalkingPoints: [
      "LIFO (Last-In, First-Out) principle with O(1) push and pop",
      "Powers function call stacks, recursion execution, and memory stack frames",
      "Used in undo/redo history, browser back/forward buttons, and parenthesis matching"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Stack: LIFO & Applications"
  },
  {
    id: 'ds-13',
    question: "What is a Queue? Explain the FIFO principle and describe 3 common real-world software applications.",
    answer: "A Queue is a linear data structure that follows the FIFO (First-In, First-Out) principle: elements are inserted at the rear (tail) and removed from the front (head).\n\nCore Operations:\n- `enqueue(item)`: Inserts element at the rear: O(1).\n- `dequeue()`: Removes element from the front: O(1).\n\n3 Real-World Applications:\n1. Breadth-First Search (BFS): Graph and tree level-order traversal algorithms utilize a queue to explore neighbors level-by-level.\n2. Operating System Task Scheduling: OS ready queues and CPU round-robin schedulers manage processes in arrival order.\n3. Asynchronous Message Brokers: Systems like RabbitMQ, AWS SQS, and printer spoolers buffer requests to prevent resource overloading.",
    keyTalkingPoints: [
      "FIFO (First-In, First-Out) principle with O(1) enqueue and dequeue",
      "Essential for Graph BFS (Breadth-First Search) level-order traversal",
      "Used in OS task scheduling, asynchronous job queues, and printer spooling"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Queue: FIFO & Applications"
  },
  {
    id: 'ds-14',
    question: "What is the difference between Linear Data Structures and Non-Linear Data Structures? Give examples of each.",
    answer: "1. Linear Data Structures:\n- Elements are arranged sequentially or linearly, where each element is attached to its previous and next adjacent element.\n- Single-level hierarchy traversed in a single run.\n- Examples: Arrays, Singly/Doubly Linked Lists, Stacks, Queues.\n\n2. Non-Linear Data Structures:\n- Elements are arranged in a hierarchical or interconnected network where one element can be connected to multiple other elements.\n- Multi-level relationship; cannot be traversed in a single pass.\n- Examples: Trees (Binary Trees, BST, Heaps, Tries) and Graphs (Directed, Undirected networks).",
    keyTalkingPoints: [
      "Linear structures: Sequential contiguous/pointer chain (Array, Stack, Queue, Linked List)",
      "Non-Linear structures: Multi-level hierarchical/network connections (Tree, Graph)",
      "Linear is simpler to traverse; Non-linear represents complex relationships and fast hierarchical search"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Linear vs Non-Linear Data Structures"
  },
  {
    id: 'ds-15',
    question: "What is the difference between a Singly Linked List and a Doubly Linked List? Compare memory overhead and traversal directions.",
    answer: "1. Singly Linked List:\n- Node Structure: Stores `data` and a single `next` pointer.\n- Traversal: Unidirectional (forward only from head to tail).\n- Memory Overhead: Minimal (1 pointer per node).\n- Deletion: Requires O(N) traversal to find predecessor.\n\n2. Doubly Linked List:\n- Node Structure: Stores `data`, `next` pointer, and `prev` pointer.\n- Traversal: Bidirectional (can traverse forward and backward).\n- Memory Overhead: Higher (2 pointers per node).\n- Deletion: Can delete a given node in O(1) without predecessor traversal.",
    keyTalkingPoints: [
      "Singly Linked List has 1 pointer (unidirectional traversal)",
      "Doubly Linked List has 2 pointers (bidirectional traversal, O(1) node deletion)",
      "Doubly Linked List consumes extra memory for previous pointer storage"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Singly vs Doubly Linked List"
  },
  {
    id: 'ds-16',
    question: "What is a Binary Tree? Explain Full Binary Tree, Complete Binary Tree, and Perfect Binary Tree.",
    answer: "A Binary Tree is a hierarchical tree data structure where each node has at most two children, referred to as the left child and right child.\n\nTypes of Binary Trees:\n1. Full (Strict) Binary Tree: Every node has either 0 or 2 children (no node has only 1 child).\n2. Complete Binary Tree: All levels are completely filled except possibly the last level, which is filled strictly from left to right (basis for Binary Heaps).\n3. Perfect Binary Tree: All internal nodes have 2 children and all leaf nodes are at the exact same depth. Total nodes = `2^(h+1) - 1`.",
    keyTalkingPoints: [
      "Binary Tree: Max 2 children per node (left and right)",
      "Full: 0 or 2 children; Complete: filled left-to-right at last level",
      "Perfect: All interior nodes have 2 children, all leaves at identical depth"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Binary Tree Types & Terminology"
  },
  {
    id: 'ds-17',
    question: "Explain the three standard Depth-First Tree Traversals: Inorder, Preorder, and Postorder. What is the special property of Inorder traversal on a BST?",
    answer: "Depth-First Tree Traversals recursively visit nodes in specific orders:\n\n1. Inorder Traversal (Left -> Root -> Right):\n- Visit left subtree, visit root, visit right subtree.\n- Special BST Property: Inorder traversal of a Binary Search Tree produces elements in strictly ascending SORTED order!\n\n2. Preorder Traversal (Root -> Left -> Right):\n- Visit root first, then left subtree, then right subtree.\n- Use Case: Creating a clone/copy of the tree or serializing tree structure.\n\n3. Postorder Traversal (Left -> Right -> Root):\n- Visit left subtree, visit right subtree, visit root last.\n- Use Case: Deleting a tree from bottom-up (freeing child memory before root) and Postfix expression evaluation.",
    keyTalkingPoints: [
      "Inorder (Left, Root, Right) outputs BST elements in sorted order",
      "Preorder (Root, Left, Right) is used for tree copying and serialization",
      "Postorder (Left, Right, Root) is used for bottom-up node deletion and calculation"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Tree Traversals: Inorder, Preorder, Postorder"
  },
  {
    id: 'ds-18',
    question: "What is a Circular Linked List? How does it differ from a standard Linked List and where is it used?",
    answer: "A Circular Linked List is a sequence of elements where the last node's `next` pointer points back to the `head` node instead of containing `NULL`.\n\nKey Differences:\n- Standard Linked List ends with `NULL`; Circular Linked List has no `NULL` end and forms a continuous loop.\n- Can begin traversal from any node and reach all nodes.\n\nPractical Applications:\n1. Operating System Round-Robin Scheduling: The OS cycles through ready processes in a circular queue.\n2. Multiplayer Gaming: Turn-based game engines cycle through players in a continuous loop.\n3. Audio/Media Playlists: Continuous loop playback modes.",
    keyTalkingPoints: [
      "Last node points back to the first node (no NULL terminator)",
      "Enables continuous circular traversal from any starting point",
      "Used in OS Round-Robin process scheduling and multiplayer turn systems"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Circular Linked List & Round-Robin"
  },
  {
    id: 'ds-19',
    question: "What is the difference between Stack Memory and Heap Memory in program execution?",
    answer: "1. Stack Memory:\n- Used for static memory allocation: primitive variables and function call execution frames.\n- Managed automatically by the CPU architecture (allocated on function entry, freed on function return).\n- Fast allocation (moving the stack pointer register); limited in size (can cause `StackOverflowError` if recursion is unbounded).\n\n2. Heap Memory:\n- Used for dynamic memory allocation: objects, reference types, and arrays allocated with `new`.\n- Managed by the developer (C/C++ `malloc`/`free`) or automatic Garbage Collector (Java, Python, JS).\n- Slower access and potential memory fragmentation, but much larger in capacity.",
    keyTalkingPoints: [
      "Stack: Fast, CPU-managed, static allocation, stores local primitives and call frames",
      "Heap: Larger, dynamic allocation, stores objects, managed via GC or manual free",
      "Stack overflow occurs from deep recursion; OutOfMemory occurs when Heap is exhausted"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Stack Memory vs Heap Memory"
  },
  {
    id: 'ds-20',
    question: "What is Big-O Notation and Time Complexity? Explain O(1), O(log N), O(N), and O(N^2) with simple examples.",
    answer: "Big-O Notation mathematically describes the upper bound (worst-case scenario) of an algorithm's execution time or memory growth as the input size N grows toward infinity.\n\nCommon Time Complexities:\n1. O(1) - Constant Time: Execution time is independent of input size.\n   Example: Accessing an array element by index (`arr[0]`), Hash table lookup.\n2. O(log N) - Logarithmic Time: The problem size is halved at each step.\n   Example: Binary Search in a sorted array.\n3. O(N) - Linear Time: Execution time scales directly in proportion to input size.\n   Example: Linear search through an unsorted array, finding maximum element.\n4. O(N^2) - Quadratic Time: Execution time scales with the square of input size.\n   Example: Nested loops, Bubble Sort, Selection Sort on an array of size N.",
    keyTalkingPoints: [
      "Big-O measures asymptotic rate of growth as input size N approaches infinity",
      "O(1) Constant < O(log N) Logarithmic < O(N) Linear < O(N^2) Quadratic",
      "Binary search is O(log N); Linear search is O(N); Nested loop is O(N^2)"
    ],
    category: "Data Structures",
    difficulty: "Easy",
    contextTag: "Big-O Notation & Time Complexity"
  },

  // ==========================================
  // 3. OOPS & DESIGN PATTERNS (20 Questions)
  // ==========================================
  {
    id: 'oops-1',
    question: "Explain the four core pillars of Object-Oriented Programming (OOP) with real-world examples: Encapsulation, Abstraction, Inheritance, and Polymorphism.",
    answer: "1. Encapsulation: Bundling data (attributes) and methods that operate on that data into a single class, while restricting direct access to internal state using private access modifiers (e.g. BankAccount with private `balance` modified only via `deposit()` and `withdraw()`).\n\n2. Abstraction: Hiding internal implementation complexities and exposing only clean, high-level interfaces (e.g. A Car exposes a simple `accelerate()` pedal without exposing fuel injection mechanics).\n\n3. Inheritance: Mechanism where a child/derived class acquires attributes and methods of a parent/base class, promoting code reuse (e.g. `ElectricCar` extends `Vehicle`).\n\n4. Polymorphism: Ability of an entity to take on multiple forms.\n- Compile-Time (Overloading): Same method name with different parameter signatures.\n- Runtime (Overriding): Subclass provides specific implementation of a parent method via virtual method table (vtable) dispatch (e.g. `Shape.draw()` implemented differently by `Circle` and `Square`).",
    keyTalkingPoints: [
      "Encapsulation: Data hiding via private fields and public getters/setters",
      "Abstraction: Exposing clean interfaces while hiding complex subsystem internals",
      "Inheritance: Hierarchical code reuse via parent-child class relationships",
      "Polymorphism: Compile-time (Overloading) and Runtime (Overriding with vtables)"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "4 Pillars of OOP"
  },
  {
    id: 'oops-2',
    question: "Break down the SOLID design principles with concrete violations and refactored architectural solutions.",
    answer: "1. Single Responsibility Principle (SRP): A class should have one, and only one, reason to change. (e.g. Separate `InvoiceCalculator` from `InvoicePdfPrinter` and `InvoiceRepository`).\n\n2. Open/Closed Principle (OCP): Software entities should be open for extension, but closed for modification. (e.g. Use a `PaymentProcessor` interface where new payment types like `CryptoPayment` extend without modifying core checkout code).\n\n3. Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without breaking program correctness. (Violation: `Square` extending `Rectangle` where setting width alters height).\n\n4. Interface Segregation Principle (ISP): Clients should not be forced to depend upon interfaces they do not use. Split large 'fat' interfaces into focused, role-specific interfaces.\n\n5. Dependency Inversion Principle (DIP): High-level modules should not depend on low-level modules; both should depend on abstractions (e.g. inject `INotificationService` into `UserService` rather than hardcoding `SendGridApi`).",
    keyTalkingPoints: [
      "SRP: One class, one responsibility / reason to change",
      "OCP: Extend functionality via interfaces without modifying existing code",
      "LSP: Derived classes must honor base class contracts seamlessly",
      "ISP: Fine-grained interfaces over monolithic interfaces",
      "DIP: Depend on abstractions/interfaces, enabling Dependency Injection (IoC)"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Medium",
    contextTag: "SOLID Principles"
  },
  {
    id: 'oops-3',
    question: "Compare the Factory Method Pattern with the Abstract Factory Pattern. When should you use which?",
    answer: "1. Factory Method (Creational):\n- Uses inheritance and delegates object creation to a factory method in subclasses.\n- Focuses on creating a single product (e.g. `Dialog.createButton()` overridden by `WindowsDialog` and `WebDialog`).\n\n2. Abstract Factory (Creational):\n- Provides an interface for creating families of related or dependent objects without specifying their concrete classes.\n- Focuses on creating multi-product suites (e.g. `GUIFactory` creates `Button`, `Checkbox`, and `Scrollbar` together for `DarkTheme` vs `LightTheme`).",
    keyTalkingPoints: [
      "Factory Method creates one product via subclass method overriding",
      "Abstract Factory creates entire families of coordinated products",
      "Both decouple client code from concrete class instantiations"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Medium",
    contextTag: "Factory vs Abstract Factory"
  },
  {
    id: 'oops-4',
    question: "How do you implement a Thread-Safe Singleton Pattern using Double-Checked Locking in Java / C++? Why is the `volatile` keyword mandatory?",
    answer: "Double-Checked Locking implementation in Java:\n\npublic class DatabaseConnectionPool {\n    private static volatile DatabaseConnectionPool instance;\n\n    private DatabaseConnectionPool() { /* private constructor */ }\n\n    public static DatabaseConnectionPool getInstance() {\n        if (instance == null) { // 1st check (no lock overhead)\n            synchronized (DatabaseConnectionPool.class) {\n                if (instance == null) { // 2nd check (thread-safe lock)\n                    instance = new DatabaseConnectionPool();\n                }\n            }\n        }\n        return instance;\n    }\n}\n\nWhy `volatile` is Mandatory:\nWithout `volatile`, the CPU and JVM compiler can reorder instructions during `instance = new DatabaseConnectionPool()`:\n1. Allocate memory -> 2. Assign memory address to `instance` pointer -> 3. Run constructor.\nIf thread B calls `getInstance()` while thread A is between step 2 and 3, thread B sees a non-null `instance` pointer and returns an uninitialized, partially constructed object, causing catastrophic crashes. `volatile` enforces a memory barrier preventing instruction reordering.",
    keyTalkingPoints: [
      "First check avoids synchronization lock overhead on subsequent calls",
      "Synchronized block guarantees single-thread instance creation",
      "Volatile keyword prevents instruction reordering of partially constructed objects"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Hard",
    contextTag: "Thread-Safe Singleton & Volatile"
  },
  {
    id: 'oops-5',
    question: "Explain the Strategy Design Pattern. How does it eliminate long nested if-else / switch statements?",
    answer: "The Strategy Pattern defines a family of algorithms, encapsulates each one in a separate class, and makes them interchangeable at runtime.\n\nStructure:\n1. `Strategy` Interface (e.g. `DiscountStrategy.calculate(Order order)`).\n2. Concrete Strategies (e.g. `VIPDiscount`, `SeasonalDiscount`, `NoDiscount`).\n3. `Context` Class: Holds a reference to a Strategy object and delegates calculation.\n\nEliminating If-Else:\nInstead of a 200-line `if (type == 'VIP') ... else if (type == 'SEASONAL') ...` method, client passes strategy instance (or injects via factory map), honoring Open/Closed Principle.",
    keyTalkingPoints: [
      "Encapsulates algorithms into separate classes implementing a shared interface",
      "Eliminates complex conditional if-else / switch branching",
      "Allows swapping behaviors dynamically at runtime"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Medium",
    contextTag: "Strategy Pattern"
  },
  {
    id: 'oops-6',
    question: "Explain the Observer Pattern. How does it power event-driven architectures and Pub/Sub messaging systems?",
    answer: "The Observer Pattern defines a one-to-many dependency between objects: when the Subject (Publisher) state changes, all registered Observers (Subscribers) are notified automatically.\n\nKey Components:\n- Subject: Maintains list of observers, exposes `subscribe()`, `unsubscribe()`, and `notifyAll()`.\n- Observer: Exposes `update(eventData)` callback.\n\nUse Cases: UI Event Listeners (`button.onClick`), Reactive Extensions (RxJS), Redux store subscriptions, and Distributed Pub/Sub event brokers (Kafka, RabbitMQ).",
    keyTalkingPoints: [
      "One-to-many state broadcast mechanism",
      "Decouples event producer (Subject) from consumers (Observers)",
      "Core foundation of UI event listeners, Reactive programming, and Pub/Sub"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "Observer Pattern & Pub-Sub"
  },
  {
    id: 'oops-7',
    question: "Explain the Decorator Pattern. How does it adhere to the Open/Closed principle compared to class inheritance?",
    answer: "The Decorator Pattern attaches additional responsibilities to an object dynamically at runtime by wrapping it, providing a flexible alternative to subclassing.\n\nProblem with Inheritance:\nAdding 3 optional features (e.g. Milk, Sugar, Whip to Coffee) via subclassing creates an exponential explosion of classes (`CoffeeWithMilk`, `CoffeeWithMilkAndSugar`, `CoffeeWithSugarAndWhip`, etc. - 2^N classes).\n\nDecorator Solution:\n`CoffeeDecorator` implements the `Coffee` interface and holds an internal `Coffee` reference, wrapping and chaining behaviors (`new WhipDecorator(new MilkDecorator(new SimpleCoffee()))`).",
    keyTalkingPoints: [
      "Extends object behavior dynamically at runtime without modifying source code",
      "Avoids class explosion caused by deep multi-feature subclassing",
      "Standard in Java I/O: `new BufferedReader(new FileReader('file.txt'))`"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Medium",
    contextTag: "Decorator Pattern"
  },
  {
    id: 'oops-8',
    question: "What is the difference between the Adapter Pattern and the Facade Pattern?",
    answer: "1. Adapter Pattern (Structural):\n- Converts the interface of an existing class into another interface that clients expect.\n- Goal: Make incompatible interfaces work together (e.g. converting a Legacy XML service to JSON interface).\n- Focus: Interface translation (1-to-1 adapter).\n\n2. Facade Pattern (Structural):\n- Provides a simplified, high-level interface to a complex subsystem of many classes.\n- Goal: Hide subsystem complexity (e.g. `HomeTheaterFacade.watchMovie()` coordinates Amplifier, Projector, Screen, SoundSystem in one call).\n- Focus: Interface simplification (1-to-many facade).",
    keyTalkingPoints: [
      "Adapter converts an existing incompatible interface into a target interface",
      "Facade provides a simplified unified entry point to a complex subsystem",
      "Adapter makes things work after they're designed; Facade designs an easier front-end"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "Adapter vs Facade Pattern"
  },
  {
    id: 'oops-9',
    question: "Explain the principle of 'Composition over Inheritance'. What is the Fragile Base Class problem?",
    answer: "Composition over Inheritance states that classes should achieve code reuse by containing other objects (HAS-A relationship) rather than extending parent classes (IS-A relationship).\n\nFragile Base Class Problem:\nIn tight inheritance hierarchies, modifying an internal method in a parent class can unexpectedly break subclass invariants because subclasses depend on implementation details of the parent.\n\nBenefits of Composition:\n- Black-box reuse: Component internals remain encapsulated.\n- Runtime flexibility: Inner components can be swapped dynamically.\n- Loose coupling and simplified unit testing with mocks.",
    keyTalkingPoints: [
      "Prefer HAS-A composition over IS-A inheritance hierarchies",
      "Prevents Fragile Base Class problem where parent changes break subclasses",
      "Enables flexible runtime behavior swapping and cleaner test mocking"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Medium",
    contextTag: "Composition over Inheritance"
  },
  {
    id: 'oops-10',
    question: "What is the difference between a Shallow Copy and a Deep Copy in object cloning? How do you prevent reference mutations?",
    answer: "1. Shallow Copy:\n- Duplicates the top-level object, but copies references for all nested objects and collections.\n- Result: Modifying a nested object in the clone will mutate the original object because both point to the exact same heap memory address.\n\n2. Deep Copy:\n- Recursively duplicates the top-level object and creates entirely new, distinct copies of all nested objects.\n- Result: Complete memory isolation. Modifying the clone has zero effect on the original object.\n\nImplementation:\n- Deep copy via Copy Constructors, Serialization/Deserialization, or structured clone libraries.",
    keyTalkingPoints: [
      "Shallow copy copies references to nested objects (shared memory pointers)",
      "Deep copy recursively duplicates all nested memory allocations",
      "Deep copy prevents accidental state mutations in concurrent systems"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "Shallow vs Deep Copy"
  },
  {
    id: 'oops-11',
    question: "Explain the Generational Garbage Collection hypothesis in managed runtimes (JVM / V8). How can memory leaks still occur in languages with automatic garbage collection, and how do you prevent them?",
    answer: "1. The Weak Generational Hypothesis:\n- States that most objects die young (short-lived temporary variables, loop counters). Runtimes split heap memory into Young Generation (Eden + Survivor) and Old / Tenured Generation. Minor GCs clean Young Gen rapidly with low overhead; objects that survive multiple GC cycles are promoted to Old Gen.\n\n2. How Memory Leaks Occur Despite Automatic GC:\n- In managed languages, a memory leak is an 'Unintentional Object Retention'—an object that is no longer needed by business logic remains reachable through a live GC Root reference path (e.g. Static fields, Active ThreadLocals, Unregistered event listeners, Uncleared caches, or Closures holding outer scopes).\n\nCommon Culprits & Preventions:\n- Static Collections: Unbounded static `HashMap` or `List` growing indefinitely (Fix: Use `WeakHashMap` or LRU Cache with TTL).\n- Unregistered Listeners / Observers: Registering a listener on a singleton without unregistering on component destroy (Fix: Clean up in `dispose()` / `useEffect` cleanup).\n- ThreadLocals in Thread Pools: Forgetting to call `threadLocal.remove()`, causing thread pool worker threads to retain old transaction context across task executions.",
    keyTalkingPoints: [
      "Weak Generational Hypothesis: Most objects die young (Eden -> Survivor -> Tenured promotion)",
      "Memory leak in GC = Unintentional object retention reachable from a live GC Root",
      "Common culprits: Unbounded static collections, unremoved ThreadLocals, and dangling event listeners"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Hard",
    contextTag: "Garbage Collection & Memory Leaks"
  },
  {
    id: 'oops-12',
    question: "What is the difference between Method Overloading and Method Overriding in OOP? Compare compile-time versus runtime binding.",
    answer: "1. Method Overloading (Compile-Time / Static Polymorphism):\n- Methods in the same class share the same name but have DIFFERENT parameter lists (different number, types, or order of arguments).\n- Return type alone cannot differentiate overloaded methods.\n- Resolved at compile time by the compiler based on method signature.\n\n2. Method Overriding (Runtime / Dynamic Polymorphism):\n- Subclass provides a specific implementation of a method that is already defined in its superclass.\n- Must have the EXACT SAME name, parameter list, and return type (or covariant return type).\n- Resolved at runtime using dynamic dispatch (virtual method tables / vtables).",
    keyTalkingPoints: [
      "Overloading: Same class, same name, different parameters (Compile-time binding)",
      "Overriding: Subclass redefines superclass method with exact same signature (Runtime binding)",
      "Overriding requires inheritance; Overloading does not"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "Overloading vs Overriding"
  },
  {
    id: 'oops-13',
    question: "What is the difference between an Abstract Class and an Interface? When should you choose one over the other?",
    answer: "1. Abstract Class:\n- Can contain both abstract methods (without body) and concrete methods (with implementation).\n- Can declare instance variables (state) and constructors.\n- A class can extend only ONE abstract class (single inheritance).\n- Use When: Objects share common code implementation and internal state (e.g. `Animal` base class with `eat()` logic).\n\n2. Interface:\n- Defines a contract of behavior that implementing classes must fulfill.\n- Traditionally contains only method signatures (Java 8+ allows default/static methods).\n- All fields are implicitly `public static final` constants.\n- A class can implement MULTIPLE interfaces (multiple inheritance of type).\n- Use When: Defining capabilities across unrelated classes (e.g. `Comparable`, `Serializable`, `Flyable`).",
    keyTalkingPoints: [
      "Abstract Class: Can hold state, constructors, and partial implementation (Single inheritance)",
      "Interface: Pure behavioral contract, multiple interfaces can be implemented",
      "Use abstract class for IS-A shared code; Use interface for CAN-DO capabilities"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "Abstract Class vs Interface"
  },
  {
    id: 'oops-14',
    question: "What is a Constructor in Object-Oriented Programming? Explain Default, Parameterized, and Copy Constructors.",
    answer: "A Constructor is a special member method of a class that is automatically invoked when an instance of the class is created with `new`. Its primary purpose is to initialize the object's internal state.\n\nTypes of Constructors:\n1. Default Constructor: A constructor with no parameters automatically provided by the compiler if no explicit constructor is defined.\n2. Parameterized Constructor: Accepts arguments to initialize object attributes with custom values upon creation.\n3. Copy Constructor: Initializes a new object by copying the field values from an existing object of the same class (`Point(Point p)`).",
    keyTalkingPoints: [
      "Constructor initializes object state upon creation; has no return type",
      "Default (no-arg), Parameterized (custom inputs), and Copy (duplicate state)",
      "Constructor name must match class name exactly"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "OOP Constructors & Initialization"
  },
  {
    id: 'oops-15',
    question: "What is the 'this' (or 'self') keyword in Object-Oriented Programming, and what are its primary use cases?",
    answer: "The `this` keyword is a reference variable that refers to the current instance of the class on which a method or constructor is being invoked.\n\nPrimary Use Cases:\n1. Resolving Variable Shadowing: Disambiguates instance variables from constructor/method parameters with identical names (`this.name = name`).\n2. Constructor Chaining: Invokes another constructor in the same class (`this(10, 'default')`).\n3. Passing Current Object: Passes `this` as an argument to other methods or event listeners.\n4. Method Chaining: Returning `this` allows builder pattern method chaining (`builder.setName().setAge()`).",
    keyTalkingPoints: [
      "`this` refers to the current object instance in memory",
      "Resolves naming shadowing between instance variables and local parameters",
      "Used for constructor chaining and returning self for method chaining"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "The 'this' Reference Keyword"
  },
  {
    id: 'oops-16',
    question: "What are Access Modifiers (public, private, protected, default) and why are they fundamental for Encapsulation?",
    answer: "Access Modifiers control the visibility and accessibility of classes, methods, and variables to enforce Encapsulation and Data Hiding:\n\n1. `private`: Accessible ONLY within the defining class (Maximum data hiding).\n2. `default` (Package-Private): Accessible only within classes in the same package/namespace.\n3. `protected`: Accessible within the same package AND by subclasses in other packages.\n4. `public`: Accessible from any class anywhere in the application (Maximum visibility).\n\nEncapsulation Rule: Fields should generally be declared `private` and accessed via `public` or `protected` getter/setter methods to enforce validation and prevent uncontrolled state corruption.",
    keyTalkingPoints: [
      "Private (defining class only) provides maximum encapsulation",
      "Protected allows package + subclass access; Public allows universal access",
      "Enforces encapsulation by guarding object state against unauthorized external mutation"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "Access Modifiers & Encapsulation"
  },
  {
    id: 'oops-17',
    question: "Explain the differences between Association, Aggregation, and Composition in Object-Oriented Design.",
    answer: "These terms describe relationship coupling between classes:\n\n1. Association: A general relationship where two independent classes use each other (e.g. Teacher and Student). Lifecycles are completely independent.\n\n2. Aggregation (Weak HAS-A): A specialized association representing a 'has-a' relationship where child objects can exist independently of the parent container (e.g. Department and Professor; if Department closes, Professor still exists).\n\n3. Composition (Strong HAS-A / Part-Whole): A strong 'part-of' relationship where the child object's lifecycle is strictly bound to the parent (e.g. House and Rooms; if the House is destroyed, the Rooms cease to exist).",
    keyTalkingPoints: [
      "Association: Generic independent relationship (Teacher - Student)",
      "Aggregation: Weak HAS-A relationship; child survives parent deletion (Department - Professor)",
      "Composition: Strong HAS-A relationship; child dies with parent (House - Room)"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "Association, Aggregation & Composition"
  },
  {
    id: 'oops-18',
    question: "How does Exception Handling work in OOP? Explain try, catch, finally, and the difference between Checked and Unchecked exceptions.",
    answer: "Exception Handling provides a structured mechanism to intercept and handle runtime errors without crashing the entire program.\n\nKey Blocks:\n- `try`: Encloses code that may throw an exception.\n- `catch`: Intercepts and handles specific exception types.\n- `finally`: Code block that is ALWAYS executed regardless of whether an exception occurred (used to close DB connections, files, sockets).\n\nChecked vs Unchecked Exceptions (e.g. Java):\n- Checked Exceptions: Checked at compile-time (e.g. `IOException`, `SQLException`). Method must handle with `try-catch` or declare with `throws`.\n- Unchecked Exceptions (Runtime): Not checked at compile-time (e.g. `NullPointerException`, `ArrayIndexOutOfBoundsException`). Represent programming bugs.",
    keyTalkingPoints: [
      "`try` executes risky code, `catch` handles error, `finally` always runs for resource cleanup",
      "Checked exceptions are verified at compile time (must be caught or declared)",
      "Unchecked (Runtime) exceptions represent logic errors (e.g. NullPointer)"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "Exception Handling: try, catch, finally"
  },
  {
    id: 'oops-19',
    question: "What is the 'final' (or 'const' / 'readonly') keyword when applied to variables, methods, and classes in OOP?",
    answer: "The `final` keyword restricts modification:\n\n1. Final Variable: Value cannot be reassigned after initialization (creates a constant). For objects, the reference pointer is constant, but object properties can still mutate.\n2. Final Method: Method cannot be overridden by any subclass (prevents altering core algorithm logic).\n3. Final Class: Class cannot be subclassed or inherited (e.g. `java.lang.String` is final for security and immutability).",
    keyTalkingPoints: [
      "Final variable = Constant value (cannot be reassigned)",
      "Final method = Cannot be overridden by subclasses",
      "Final class = Cannot be inherited / extended (ensures immutability and security)"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "The 'final' Keyword in OOP"
  },
  {
    id: 'oops-20',
    question: "What is the difference between Early Binding (Static Binding) and Late Binding (Dynamic Binding)?",
    answer: "1. Early Binding (Static Binding):\n- Method resolution occurs at COMPILE TIME.\n- Used for: `private`, `static`, and `final` methods, as well as overloaded methods.\n- Faster execution because compiler knows the exact memory address to invoke with zero runtime lookup.\n\n2. Late Binding (Dynamic Binding):\n- Method resolution occurs at RUNTIME based on the actual runtime object instance.\n- Used for: Overridden virtual methods.\n- Achieved via virtual method tables (vtables), enabling true runtime polymorphism.",
    keyTalkingPoints: [
      "Early binding resolves methods at compile time (static, private, final, overloaded)",
      "Late binding resolves methods at runtime (overridden virtual methods)",
      "Late binding is the mechanism that enables runtime polymorphism"
    ],
    category: "OOPs & Design Patterns",
    difficulty: "Easy",
    contextTag: "Early vs Late Binding"
  },

  // ==========================================
  // 4. OPERATING SYSTEMS (20 Questions)
  // ==========================================
  {
    id: 'os-1',
    question: "Explain the fundamental differences between a Process and a Thread in terms of memory address space, context switching cost, and IPC.",
    answer: "1. Memory Space:\n- Process: An executing program instance with its own isolated virtual address space (Text, Data, BSS, Heap, Stack). Memory is protected by hardware MMU.\n- Thread: Lightweight execution unit within a process. Threads share the process heap, code, and open file descriptors, but each thread has its own private Stack, Program Counter (PC), and CPU Registers.\n\n2. Context Switching Overhead:\n- Process Switch: Expensive because OS must flush Translation Lookaside Buffers (TLB), invalidate CPU caches, and switch page tables.\n- Thread Switch: Inexpensive because memory page tables and TLB remain identical within the same process.\n\n3. Inter-Process Communication (IPC):\n- Processes require OS mediation (Pipes, Sockets, Shared Memory, Message Queues).\n- Threads communicate directly via shared heap variables with synchronization primitives (Mutex, Semaphore).",
    keyTalkingPoints: [
      "Process has isolated virtual memory space; threads share process heap/code",
      "Process context switch requires TLB/page table flush (high overhead)",
      "Threads context switch is lightweight within same process",
      "Process IPC requires OS mediation; thread IPC uses shared memory with locks"
    ],
    category: "Operating Systems",
    difficulty: "Medium",
    contextTag: "Process vs Thread Architecture"
  },
  {
    id: 'os-2',
    question: "What is a Deadlock? Explain the 4 Coffman Conditions required for a deadlock to occur and how each condition can be prevented.",
    answer: "A Deadlock occurs when a set of concurrent processes are permanently blocked because each process holds a resource while waiting for another resource held by another process.\n\n4 Coffman Conditions (ALL 4 must hold simultaneously):\n1. Mutual Exclusion: At least one resource must be held in non-shareable mode.\n   - Prevention: Make resources shareable (e.g. read-only lock sharing).\n2. Hold and Wait: A process holds at least one resource and requests additional resources held by others.\n   - Prevention: Require processes to request all resources at once before execution.\n3. No Preemption: Resources cannot be forcibly taken from a process holding them.\n   - Prevention: If a process cannot acquire next resource, it must release all currently held resources.\n4. Circular Wait: A closed chain of processes exists where each process waits for a resource held by the next.\n   - Prevention: Enforce a global strict resource hierarchy ordering (Resource Ordering). Processes must acquire resources in strictly increasing numerical order.",
    keyTalkingPoints: [
      "Deadlock requires all 4 Coffman conditions simultaneously",
      "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait",
      "Resource Ordering (enforcing lock acquisition hierarchy) eliminates Circular Wait"
    ],
    category: "Operating Systems",
    difficulty: "Medium",
    contextTag: "Deadlocks & Coffman Conditions"
  },
  {
    id: 'os-3',
    question: "Compare synchronization primitives: Mutex, Counting Semaphore, Binary Semaphore, and Spinlock. When should you use a Spinlock over a Mutex?",
    answer: "1. Mutex (Mutual Exclusion Lock):\n- Locking mechanism with ownership: only the thread that acquired the mutex can release it.\n- Sleeping lock: thread is descheduled and sleeps if lock is unavailable.\n\n2. Binary Semaphore:\n- Signaling mechanism with values 0 or 1. No ownership: thread A can wait while thread B signals.\n\n3. Counting Semaphore:\n- Maintains integer counter representing available resource units (e.g. database connection pool limit).\n\n4. Spinlock:\n- Thread repeatedly polls ('spins') in a tight CPU loop using atomic `test-and-set` without sleeping.\n- When to use Spinlock: In kernel contexts (interrupt handlers) or when critical section execution time is shorter than the context-switch sleep/wake overhead (~microseconds).",
    keyTalkingPoints: [
      "Mutex has thread ownership; Semaphore is a signaling mechanism without ownership",
      "Counting semaphore manages pools of identical resources",
      "Spinlock avoids context switch sleep overhead for microsecond critical sections"
    ],
    category: "Operating Systems",
    difficulty: "Hard",
    contextTag: "Mutex vs Semaphore vs Spinlock"
  },
  {
    id: 'os-4',
    question: "Explain Virtual Memory, Paging, Page Tables, the TLB (Translation Lookaside Buffer), and the step-by-step handling of a Page Fault.",
    answer: "1. Virtual Memory Architecture:\n- Decouples program logical address space from physical RAM, providing isolated memory protection and allowing programs to exceed physical RAM capacity.\n- Paging splits virtual memory into fixed-size chunks (Pages, typically 4KB) mapped to physical RAM frames via Page Tables.\n- TLB: High-speed hardware cache in the MMU storing recent Virtual -> Physical translations.\n\n2. Page Fault Interrupt Flow:\n1. CPU accesses virtual address not present in physical RAM (Valid-Invalid bit = 0 in Page Table).\n2. Hardware MMU raises a Page Fault interrupt trap to OS kernel.\n3. OS pauses process and finds an empty physical RAM frame (or evicts a page using LRU page replacement).\n4. OS issues disk I/O to read page from Swap Space / Pagefile into allocated RAM frame.\n5. OS updates Page Table with new physical frame number and sets Valid bit = 1.\n6. CPU restarts the faulted instruction transparently.",
    keyTalkingPoints: [
      "Virtual memory provides memory isolation and simulated large address space",
      "TLB caches page table translations for fast MMU lookups",
      "Page Fault trap pauses process, reads page from disk swap, updates page table, and resumes"
    ],
    category: "Operating Systems",
    difficulty: "Hard",
    contextTag: "Virtual Memory, Paging & Page Faults"
  },
  {
    id: 'os-5',
    question: "What is Thrashing in Operating Systems? Explain the Working Set Model and how the OS detects and resolves thrashing.",
    answer: "1. Thrashing:\n- A severe state where the CPU spends significantly more time swapping pages in and out of disk than executing actual instructions, causing system throughput to plunge to near zero.\n- Cause: Total memory demand of all active processes exceeds available physical RAM.\n\n2. Working Set Model (Peter Denning):\n- The Working Set `W(t, delta)` is the set of pages referenced by a process in the most recent time window `delta` (locality of reference).\n- Condition: If sum of Working Sets of all processes > Total RAM capacity, Thrashing is imminent.\n\n3. Resolution:\n- OS suspends / swaps out lower-priority processes entirely to disk to free frames for remaining processes, restoring CPU utilization.",
    keyTalkingPoints: [
      "Thrashing occurs when OS spends excessive CPU cycles page swapping to disk",
      "Caused by aggregate process memory demand exceeding physical RAM",
      "Resolved via Working Set Model by suspending lower-priority processes"
    ],
    category: "Operating Systems",
    difficulty: "Medium",
    contextTag: "Thrashing & Working Set Model"
  },
  {
    id: 'os-6',
    question: "Explain the difference between User Mode (Ring 3) and Kernel Mode (Ring 0). How does a System Call transition execution between privilege levels?",
    answer: "1. Hardware Privilege Rings (x86 CPU):\n- User Mode (Ring 3): Restricted execution. Application code cannot access hardware, execute privileged CPU instructions (CLI, HLT), or access memory outside its allocated address space.\n- Kernel Mode (Ring 0): Unrestricted execution. Full access to hardware, MMU page tables, CPU registers, and physical memory.\n\n2. System Call (Syscall) Transition:\n1. Application invokes library wrapper (e.g. `read()`).\n2. Puts syscall number into CPU register (`EAX/RAX`) and executes hardware trap instruction (`syscall` or `int 0x80`).\n3. CPU switches hardware mode from Ring 3 to Ring 0 and jumps to Kernel Interrupt Vector Table (IVT).\n4. Kernel validates arguments, executes privileged hardware driver/operation, places return value in register, and executes `sysret` to return to Ring 3.",
    keyTalkingPoints: [
      "User Mode (Ring 3) protects hardware and OS from crashing applications",
      "Kernel Mode (Ring 0) has direct unrestricted hardware and memory access",
      "System Calls use hardware traps to safely transition execution privilege rings"
    ],
    category: "Operating Systems",
    difficulty: "Medium",
    contextTag: "User Mode vs Kernel Mode & Syscalls"
  },
  {
    id: 'os-7',
    question: "Compare Inter-Process Communication (IPC) mechanisms: Pipes, Named Pipes (FIFOs), Message Queues, Shared Memory, and Unix Domain Sockets.",
    answer: "1. Anonymous Pipes: Unidirectional byte stream between related parent-child processes sharing file descriptors.\n2. Named Pipes (FIFOs): Bidirectional file system node allowing unrelated processes on same machine to communicate.\n3. Message Queues: OS-managed linked list of discrete typed messages.\n4. Shared Memory: Fastest IPC mechanism because kernel maps the same physical RAM pages into address spaces of multiple processes. Zero kernel copying overhead; requires Mutex/Semaphore synchronization.\n5. Unix Domain Sockets: Standard socket API with bi-directional streaming and datagrams, bypassing network stack for fast local IPC.",
    keyTalkingPoints: [
      "Shared Memory is the fastest IPC (zero kernel data copying, uses direct RAM access)",
      "Pipes provide simple streaming between parent-child processes",
      "Unix Domain Sockets provide bidirectional local communication without network overhead"
    ],
    category: "Operating Systems",
    difficulty: "Medium",
    contextTag: "IPC Mechanisms Comparison"
  },
  {
    id: 'os-8',
    question: "Compare CPU Scheduling Algorithms: First-Come First-Served (FCFS), Shortest Job First (SJF), and Round Robin (RR). What happens if Round Robin Time Quantum is too large or too small?",
    answer: "1. FCFS (First-Come First-Served): Non-preemptive. High average wait time due to Convoy Effect (short tasks waiting behind a long CPU burst task).\n\n2. SJF (Shortest Job First): Provably optimal minimum average waiting time. Problem: Starvation of long processes and impossible to know next CPU burst duration in advance.\n\n3. Round Robin (RR): Preemptive scheduler designed for time-sharing systems where each process receives a fixed Time Quantum (slice).\n\nTime Quantum Trade-offs:\n- If Quantum is Extremely Large: RR degenerates into FCFS (high response time for interactive tasks).\n- If Quantum is Extremely Small: CPU spends majority of time on context switching overhead rather than productive work.",
    keyTalkingPoints: [
      "FCFS suffers from the Convoy Effect (short jobs blocked by long jobs)",
      "SJF has optimal wait time but causes starvation of long jobs",
      "Round Robin time quantum balances responsiveness against context switch overhead"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "CPU Scheduling Algorithms"
  },
  {
    id: 'os-9',
    question: "What is an Inode in Unix/Linux file systems? Explain the difference between a Hard Link and a Soft (Symbolic) Link.",
    answer: "An Inode (Index Node) is a data structure on disk storing metadata about a file: file size, permissions, owner UID, timestamps, and pointers to data disk blocks (Direct, Indirect, Double Indirect). File names are stored in directory entries mapping name -> inode number.\n\nHard Link vs Soft Link:\n1. Hard Link: An additional directory entry pointing directly to the SAME Inode number. Deleting original file name does not delete data; data is freed only when Inode Link Count drops to 0. Cannot cross file system boundaries.\n2. Soft (Symbolic) Link: A distinct file with its OWN Inode containing a path string pointing to target file. If target file is moved/deleted, the symlink breaks (dangling link). Can cross file systems.",
    keyTalkingPoints: [
      "Inode stores file metadata and disk block pointers (does not store file name)",
      "Hard links share identical Inode number; file deleted only when link count reaches 0",
      "Soft links are pointer files containing target paths; can cross file systems"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "Inodes, Hard Links vs Soft Links"
  },
  {
    id: 'os-10',
    question: "Explain Internal Fragmentation versus External Fragmentation in memory allocation and how Paging and Compaction resolve them.",
    answer: "1. Internal Fragmentation:\n- Occurs when fixed-size memory blocks (pages) are allocated to a process that needs less memory than the block size (e.g. allocating a 4KB page for a 1KB string wastes 3KB inside the page).\n- Solution: Smaller page sizes (trade-off: larger page tables).\n\n2. External Fragmentation:\n- Occurs in dynamic variable-sized partitioning when total free memory is sufficient to satisfy a request, but free memory is fragmented into small non-contiguous slices.\n- Solution 1: Compaction (shifting active processes to combine free holes - high CPU overhead).\n- Solution 2: Paging (breaks process into non-contiguous pages, completely eliminating external fragmentation).",
    keyTalkingPoints: [
      "Internal Fragmentation: Unused space wasted inside fixed-size allocated blocks/pages",
      "External Fragmentation: Free memory scattered in non-contiguous slices",
      "Paging eliminates external fragmentation by allowing non-contiguous allocation"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "Internal vs External Fragmentation"
  },
  {
    id: 'os-11',
    question: "Explain the complete Thread Life Cycle in Operating Systems and Java. What are the 6 states (NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED) and what triggers transitions between them?",
    answer: "A thread progresses through defined lifecycle states managed by the OS scheduler and runtime:\n\n1. NEW (Born):\n- The thread object has been created (e.g. `Thread t = new Thread()`) but `start()` has not yet been invoked. Memory is allocated, but the OS thread has not begun execution.\n\n2. RUNNABLE (Ready / Running):\n- Once `t.start()` is called, the thread moves to RUNNABLE. It is either currently executing on a CPU core or sitting in the OS Ready Queue waiting for a CPU time slice from the scheduler.\n\n3. BLOCKED (Waiting for a Monitor Lock):\n- The thread is attempting to acquire a synchronized lock or mutex that is currently held by another thread. It cannot proceed until the lock is released.\n\n4. WAITING (Indefinite Wait):\n- The thread is waiting indefinitely for another thread to perform a specific action. Triggered by `Object.wait()`, `Thread.join()`, or `LockSupport.park()`. It transitions back to RUNNABLE when another thread calls `notify()`, `notifyAll()`, or the joined thread finishes.\n\n5. TIMED_WAITING (Timed Wait):\n- The thread is paused for a specified duration. Triggered by `Thread.sleep(ms)`, `Object.wait(timeout)`, `join(timeout)`, or `LockSupport.parkNanos()`. It returns to RUNNABLE automatically when the time expires or upon notification.\n\n6. TERMINATED (Dead):\n- The thread has completed its `run()` method execution or exited prematurely due to an unhandled exception.",
    keyTalkingPoints: [
      "6 States: NEW -> RUNNABLE -> (BLOCKED / WAITING / TIMED_WAITING) -> TERMINATED",
      "BLOCKED specifically waits for monitor lock acquisition",
      "WAITING is indefinite (requires notify); TIMED_WAITING wakes up automatically after sleep/timeout"
    ],
    category: "Operating Systems",
    difficulty: "Medium",
    contextTag: "Thread Life Cycle & State Transitions"
  },
  {
    id: 'os-12',
    question: "Explain Synchronous vs Asynchronous I/O, Blocking vs Non-Blocking I/O, and how I/O Multiplexing mechanisms (select, poll, epoll, kqueue) enable high-concurrency event-driven servers.",
    answer: "I/O operations involve two distinct phases: 1) Waiting for data to be ready in the kernel buffer, 2) Copying data from kernel space to user space.\n\n1. I/O Models Comparison:\n- Blocking I/O: The calling thread sleeps during both Phase 1 and Phase 2. Requires 1 thread per connection (fails to scale past 10,000 connections due to thread memory overhead).\n- Non-Blocking I/O: System call returns immediately with `EWOULDBLOCK`/`EAGAIN` if data is not ready, requiring busy polling.\n- I/O Multiplexing (`epoll` on Linux, `kqueue` on BSD/macOS): Monitors thousands of file descriptors simultaneously on a single thread. The thread sleeps until one or more descriptors become ready, eliminating thread-per-connection overhead.\n- Asynchronous I/O (e.g. Linux `io_uring`): Kernel performs both data wait and copy to user buffer, notifying application upon completion.\n\n2. Why `epoll` outperforms `select` and `poll`:\n- `select` and `poll` are O(N): The application must pass the entire array of descriptors to the kernel and iterate through all of them on every wake-up.\n- `epoll` is O(1): Uses a Red-Black Tree in kernel space to register descriptors once (`epoll_ctl`), and an interrupt-driven ready list (`epoll_wait`) that returns only the active file descriptors, scaling efficiently to millions of connections (C10K/C1000K problem).",
    keyTalkingPoints: [
      "Blocking I/O sleeps during kernel wait and copy (1 thread per connection bottleneck)",
      "epoll (O(1)) outperforms select/poll (O(N)) using kernel event callbacks",
      "Foundation of modern event-driven architectures: Nginx, Node.js (Libuv), Redis, Netty"
    ],
    category: "Operating Systems",
    difficulty: "Hard",
    contextTag: "I/O Models & Linux epoll"
  },
  {
    id: 'os-13',
    question: "What is Zero-Copy in Linux systems (`sendfile()` system call, DMA engine), and why is it crucial for message broker (Kafka) and web server (Nginx) throughput?",
    answer: "Traditional file transfer over a network socket requires 4 context switches and 4 data copies:\n1. `read()` syscall: DMA copies data from Disk to Kernel OS Page Cache (Copy 1).\n2. CPU copies data from Kernel Page Cache to Application User Buffer (Copy 2 - context switch).\n3. `write()` syscall: CPU copies data from Application User Buffer to Socket Kernel Buffer (Copy 3 - context switch).\n4. DMA engine copies data from Socket Buffer to Network Interface Card (NIC) (Copy 4).\n\nZero-Copy with `sendfile()`:\n- The `sendfile()` system call passes file descriptor directly to socket descriptor in kernel space.\n- Data is transferred directly from the OS Page Cache to the NIC using DMA gather scatter operations, completely bypassing the User Application Buffer.\n- Result: Zero CPU data copying, only 2 context switches, and zero CPU cache pollution.\n- Why Kafka is fast: Kafka stores immutable message logs in OS page cache and streams millions of messages to consumers using `sendfile()` with near-hardware network saturation.",
    keyTalkingPoints: [
      "Traditional I/O requires 4 context switches and 4 copies (2 CPU copies through user space)",
      "Zero-Copy `sendfile()` streams data directly from OS Page Cache to NIC via DMA",
      "Enables Apache Kafka and Nginx to saturate 10Gbps+ network links with near-zero CPU usage"
    ],
    category: "Operating Systems",
    difficulty: "Hard",
    contextTag: "Linux Zero-Copy & sendfile() Architecture"
  },
  {
    id: 'os-14',
    question: "What is an Operating System and what are its four primary core functions?",
    answer: "An Operating System (OS) is system software that acts as an intermediary interface between computer hardware and application programs.\n\n4 Primary Core Functions:\n1. Process Management: Allocating CPU time, scheduling processes/threads, context switching, and deadlock resolution.\n2. Memory Management: Tracking memory usage, allocating/deallocating RAM blocks, and managing Virtual Memory via Paging.\n3. File System Management: Organizing data on disk storage via directory hierarchies, inodes, access permissions, and read/write operations.\n4. Device / I/O Management: Providing unified driver abstractions for hardware devices (disks, keyboards, network cards, GPUs) and managing interrupts.",
    keyTalkingPoints: [
      "OS acts as an intermediary bridge between user applications and bare-metal hardware",
      "Core functions: Process scheduling, Memory management, File systems, and Device I/O",
      "Provides hardware abstraction and system security"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "OS Core Functions & Architecture"
  },
  {
    id: 'os-15',
    question: "What is a CPU Context Switch? What information is stored inside the Process Control Block (PCB)?",
    answer: "A Context Switch is the procedure where the CPU transitions from executing one process to another, saving the current state so it can resume execution seamlessly later.\n\nInformation Stored in Process Control Block (PCB):\n- Process ID (PID) and Parent PID.\n- Process State (New, Ready, Running, Waiting, Terminated).\n- Program Counter (PC): Memory address of the next instruction to execute.\n- CPU Registers: Accumulators, index registers, stack pointers.\n- Memory Management Info: Page tables or segment tables.\n- Open File Descriptors and I/O status info.",
    keyTalkingPoints: [
      "Context switch saves current CPU state to PCB and loads new process state",
      "PCB stores PID, Program Counter, CPU registers, Page Tables, and open files",
      "Context switches introduce CPU overhead without running user code"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "Context Switching & PCB"
  },
  {
    id: 'os-16',
    question: "Explain the difference between Multiprogramming, Multitasking (Time-Sharing), and Multiprocessing.",
    answer: "1. Multiprogramming:\n- Keeps multiple programs in memory simultaneously. When current running job waits for I/O, CPU switches to another job to maximize CPU utilization (non-preemptive).\n\n2. Multitasking (Time-Sharing):\n- Logical extension of multiprogramming with CPU scheduling (Round-Robin) where CPU switches between tasks so rapidly that users can interact with multiple programs concurrently.\n\n3. Multiprocessing:\n- A system with two or more physical CPU processors/cores executing multiple instructions simultaneously in true parallel hardware execution.",
    keyTalkingPoints: [
      "Multiprogramming keeps CPU busy during I/O wait",
      "Multitasking shares CPU time slices rapidly across tasks",
      "Multiprocessing uses multiple physical CPU cores for true hardware parallelism"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "Multiprogramming vs Multitasking vs Multiprocessing"
  },
  {
    id: 'os-17',
    question: "What is Spooling in Operating Systems, and how does it differ from Buffering?",
    answer: "1. Spooling (Simultaneous Peripheral Operations On-Line):\n- Data is written to a temporary disk buffer (spool queue) while a slow peripheral device (like a printer) processes items at its own pace.\n- Overlaps I/O of one job with computation of other jobs.\n\n2. Buffering:\n- A temporary chunk of main memory (RAM) used to hold data during transfer between two devices operating at different speeds (e.g. video streaming buffer).\n\nDifference: Buffering uses main memory (RAM) for speed matching; Spooling uses disk storage for managing queues of complete jobs.",
    keyTalkingPoints: [
      "Spooling (SPOOL) queues jobs on disk (e.g. print spooler)",
      "Buffering uses RAM to match mismatched I/O and CPU speeds",
      "Spooling handles multiple concurrent jobs; Buffering handles single data stream"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "Spooling vs Buffering"
  },
  {
    id: 'os-18',
    question: "What is the purpose of Swap Space / Pagefile in Virtual Memory?",
    answer: "Swap Space (Pagefile in Windows, Swap partition in Linux) is dedicated secondary disk storage used as an overflow extension of physical RAM.\n\nHow It Operates:\n- When physical RAM is near full capacity, the OS memory manager identifies inactive, idle pages using Page Replacement Algorithms (LRU) and writes ('swaps out') them to the disk swap space to free physical RAM frames for active processes.\n- When the idle process wakes up and accesses swapped pages, the OS triggers a Page Fault and reads ('swaps in') the data back to RAM.",
    keyTalkingPoints: [
      "Swap space acts as secondary disk extension of physical RAM",
      "Prevents Out-Of-Memory crashes when active demand exceeds RAM capacity",
      "Disk I/O is much slower than RAM; excessive swapping leads to thrashing"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "Swap Space & Pagefiles"
  },
  {
    id: 'os-19',
    question: "What are System Calls in OS? Give examples of common system calls for process control, file management, and device communication.",
    answer: "A System Call is the programmatic interface provided by the OS kernel that allows user-space applications to request privileged hardware and kernel operations.\n\nCommon System Call Categories:\n1. Process Control: `fork()` (create child process), `exec()` (execute new binary), `exit()` (terminate), `wait()` (wait for child).\n2. File Management: `open()`, `read()`, `write()`, `close()`, `unlink()` (delete file).\n3. Device & Communication: `socket()`, `bind()`, `connect()`, `ioctl()`, `mmap()` (memory mapping).",
    keyTalkingPoints: [
      "System Calls bridge User Space (Ring 3) to Kernel Space (Ring 0)",
      "Process calls: fork, exec, exit, wait",
      "File I/O calls: open, read, write, close"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "System Calls & Categories"
  },
  {
    id: 'os-20',
    question: "What is the difference between Monolithic Kernel and Microkernel architectures?",
    answer: "1. Monolithic Kernel (e.g. Linux, traditional Unix):\n- The entire operating system (Process scheduler, VFS, Memory manager, Device Drivers, Network stack) runs as a single large process in Kernel Space (Ring 0).\n- Advantage: Extremely fast execution (direct function calls in kernel memory).\n- Disadvantage: A bug or crash in a single device driver can crash the entire system.\n\n2. Microkernel (e.g. QNX, Minix, Mach, Apple XNU hybrid):\n- Only minimal essential services (Memory management, IPC, Basic scheduling) run in Kernel Space (Ring 0).\n- Drivers, file systems, and network protocols run as user-space servers communicating via IPC message passing.\n- Advantage: Highly modular, secure, and crash-resilient (driver crash does not bring down the kernel).\n- Disadvantage: Higher IPC message-passing overhead.",
    keyTalkingPoints: [
      "Monolithic: All OS services and drivers run in Kernel Space (High speed, higher crash risk)",
      "Microkernel: Minimal kernel core; drivers and file systems run in User Space (High security/modularity)",
      "Linux is monolithic; QNX/Minix are microkernels"
    ],
    category: "Operating Systems",
    difficulty: "Easy",
    contextTag: "Monolithic Kernel vs Microkernel"
  },

  // ==========================================
  // 5. COMPUTER NETWORKS (20 Questions)
  // ==========================================
  {
    id: 'net-1',
    question: "Trace the complete lifecycle of a URL request from the moment a user hits Enter in a browser to the page rendering on screen.",
    answer: "1. URL Parsing & HSTS Check: Browser parses protocol (https), domain, and port.\n2. DNS Resolution: Browser Cache -> OS Hosts/Cache -> Recursive Resolver -> Root Server (.) -> TLD Server (.com) -> Authoritative Nameserver.\n3. TCP 3-Way Handshake: Client sends SYN -> Server returns SYN-ACK -> Client sends ACK.\n4. TLS 1.3 Handshake: ClientHello with Key Share -> ServerHello with server certificate and session key -> Asymmetric key agreement (ECDHE) -> Encrypted symmetric communication established (AES-GCM).\n5. HTTP GET Request sent -> Server processes via Load Balancer / App Server and returns HTML.\n6. Critical Rendering Path: Browser parses HTML to construct DOM, parses CSS to construct CSSOM, combines them into Render Tree, computes Layout (reflow), and Paints pixels on screen.",
    keyTalkingPoints: [
      "DNS resolution hierarchy: Browser -> OS -> Resolver -> Root -> TLD -> Authoritative",
      "TCP 3-way handshake (SYN, SYN-ACK, ACK) followed by TLS 1.3 key exchange",
      "Browser Critical Rendering Path: DOM + CSSOM -> Render Tree -> Layout -> Paint"
    ],
    category: "Computer Networks",
    difficulty: "Medium",
    contextTag: "URL Request Lifecycle & Browser Render"
  },
  {
    id: 'net-2',
    question: "Compare the OSI 7-Layer Model with the TCP/IP 4-Layer Model. Detail the protocols and responsibilities of each layer.",
    answer: "1. OSI Model Layers & Protocols:\n- Layer 7 (Application): User interface protocols (HTTP, HTTPS, DNS, SMTP, FTP, SSH).\n- Layer 6 (Presentation): Data formatting, encryption, and compression (TLS/SSL, JSON, JPEG).\n- Layer 5 (Session): Managing communication sessions (Sockets, RPC, NetBIOS).\n- Layer 4 (Transport): End-to-end reliability and flow control (TCP, UDP). Data unit: Segment / Datagram.\n- Layer 3 (Network): Logical IP routing across internetworks (IPv4, IPv6, ICMP, BGP, OSPF). Data unit: Packet.\n- Layer 2 (Data Link): Physical MAC addressing and node-to-node frame transfer (Ethernet, Wi-Fi 802.11, ARP). Data unit: Frame.\n- Layer 1 (Physical): Bitstream transmission over physical medium (Fiber, Copper cable, Radio waves). Data unit: Bit.\n\n2. TCP/IP Model Mapping:\n- Application Layer (combines OSI 7, 6, 5).\n- Transport Layer (OSI 4).\n- Internet Layer (OSI 3).\n- Network Access / Link Layer (combines OSI 2, 1).",
    keyTalkingPoints: [
      "OSI has 7 layers; TCP/IP has 4 layers (Application, Transport, Internet, Network Access)",
      "Transport layer unit is Segment (TCP) / Datagram (UDP)",
      "Network layer unit is Packet (IP); Data Link layer unit is Frame (MAC)"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "OSI 7-Layer vs TCP/IP Model"
  },
  {
    id: 'net-3',
    question: "Explain the TCP 3-Way Handshake and 4-Way Teardown mechanisms. What is the purpose of the TIME_WAIT socket state?",
    answer: "1. TCP 3-Way Handshake (Connection Establishment):\n- Step 1: Client sends `SYN` with random Sequence Number `seq = X` (State: SYN_SENT).\n- Step 2: Server replies `SYN-ACK` with `seq = Y` and `ack = X + 1` (State: SYN_RECEIVED).\n- Step 3: Client sends `ACK` with `ack = Y + 1` (State: ESTABLISHED).\n\n2. TCP 4-Way Teardown (Connection Termination):\n- Step 1: Client sends `FIN` (State: FIN_WAIT_1).\n- Step 2: Server sends `ACK` (State: CLOSE_WAIT on server, FIN_WAIT_2 on client).\n- Step 3: Server finishes remaining data and sends `FIN` (State: LAST_ACK).\n- Step 4: Client sends `ACK` and enters `TIME_WAIT` state for `2 * MSL` (Maximum Segment Lifetime, typically 60-120 seconds).\n\nWhy TIME_WAIT is Essential:\n1. Ensures server receives final ACK (if ACK is lost, server retransmits FIN, which client can re-ACK).\n2. Allows lingering duplicate packets from old connection to expire in network, preventing corruption of future connections using the same port tuple.",
    keyTalkingPoints: [
      "3-Way Handshake: SYN -> SYN-ACK -> ACK establishes sequence synchronization",
      "4-Way Teardown: FIN -> ACK -> FIN -> ACK cleanly closes bidirectional stream",
      "TIME_WAIT (2*MSL) ensures delayed packets expire and guarantees final ACK delivery"
    ],
    category: "Computer Networks",
    difficulty: "Medium",
    contextTag: "TCP Handshake, Teardown & TIME_WAIT"
  },
  {
    id: 'net-4',
    question: "Compare TCP and UDP protocols. How do reliability, ordering, flow control, and header overhead differ, and when is UDP preferred?",
    answer: "1. TCP (Transmission Control Protocol):\n- Connection-oriented, reliable (guaranteed delivery via ACKs and retransmissions), in-order byte stream.\n- Implements Flow Control (Sliding Window) and Congestion Control (Slow Start, Congestion Avoidance).\n- Header Size: 20-60 bytes.\n- Use Cases: Web traffic (HTTP/HTTPS), email (SMTP), file transfer (FTP), SSH.\n\n2. UDP (User Datagram Protocol):\n- Connectionless, unreliable (fire-and-forget), unordered independent datagrams.\n- No flow control, zero handshake latency, minimal header overhead (8 bytes).\n- Use Cases: Real-time gaming, live video streaming (WebRTC), VoIP, DNS queries, and modern QUIC protocol.",
    keyTalkingPoints: [
      "TCP is connection-oriented, reliable, and ordered (20+ byte header)",
      "UDP is connectionless, lightweight, and low-latency (8 byte header)",
      "Use UDP for real-time streaming, multiplayer gaming, DNS, and QUIC"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "TCP vs UDP Comparison"
  },
  {
    id: 'net-5',
    question: "Explain the evolutionary differences between HTTP/1.1, HTTP/2, and HTTP/3 (QUIC). What problems does each iteration solve?",
    answer: "1. HTTP/1.1:\n- Text-based protocol. Supported Keep-Alive persistent connections.\n- Flaw: Head-of-Line (HoL) blocking at application level: each TCP connection could only process 1 request/response at a time, requiring browser connection pooling (6 connections per domain).\n\n2. HTTP/2:\n- Binary framing layer. Multiplexes multiple requests/responses as independent streams over a SINGLE TCP connection.\n- Features: Header Compression (HPACK), Server Push, and Stream Prioritization.\n- Flaw: TCP Head-of-Line Blocking: A single dropped packet stalls ALL multiplexed streams on the TCP connection.\n\n3. HTTP/3 (QUIC):\n- Bypasses TCP completely; built on QUIC over UDP.\n- Independent stream multiplexing: Packet loss on Stream A has ZERO impact on Stream B.\n- 0-RTT Connection Resumption and Connection Migration (IP changes between Wi-Fi and 5G do not drop the session).",
    keyTalkingPoints: [
      "HTTP/1.1: Text protocol with request Head-of-Line blocking",
      "HTTP/2: Binary framing and stream multiplexing over single TCP connection (HPACK)",
      "HTTP/3: QUIC over UDP eliminating TCP transport Head-of-Line blocking with 0-RTT resumption"
    ],
    category: "Computer Networks",
    difficulty: "Hard",
    contextTag: "HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC"
  },
  {
    id: 'net-6',
    question: "How does a TLS 1.3 Cryptographic Handshake establish secure HTTPS communication? Compare Asymmetric vs Symmetric encryption.",
    answer: "TLS 1.3 reduces handshake latency to 1-RTT (and 0-RTT resumption) combining two encryption paradigms:\n\n1. Asymmetric Encryption (Public-Key Cryptography - Slow):\n- Used ONLY during the initial handshake to authenticate server identity via X.509 certificates and safely negotiate a shared session key without transmitting the key over the wire.\n- Uses Elliptic Curve Diffie-Hellman Ephemeral (ECDHE) for Perfect Forward Secrecy (PFS).\n\n2. Symmetric Encryption (Shared Secret - Extremely Fast):\n- Once the shared secret key is agreed upon, all application payload data is encrypted using high-speed symmetric ciphers (AES-GCM or ChaCha20-Poly1305) with hardware CPU acceleration.\n\nHandshake Flow (1-RTT):\n1. Client -> Server: `ClientHello` + Supported Ciphers + Client ECDHE Key Share.\n2. Server -> Client: `ServerHello` + Server ECDHE Key Share + Encrypted Certificate.\n3. Both derive identical Symmetric Session Key and begin encrypted HTTP transfer immediately.",
    keyTalkingPoints: [
      "Asymmetric encryption (ECDHE + Certificates) used strictly for authentication and key agreement",
      "Symmetric encryption (AES-GCM) used for bulk payload data transfer (fast hardware acceleration)",
      "TLS 1.3 completes handshake in 1-RTT with Perfect Forward Secrecy"
    ],
    category: "Computer Networks",
    difficulty: "Hard",
    contextTag: "TLS 1.3 Cryptographic Handshake"
  },
  {
    id: 'net-7',
    question: "Explain the DNS Resolution Hierarchy. What is the difference between a Recursive DNS Query and an Iterative DNS Query?",
    answer: "1. DNS Hierarchy:\n- Root Nameservers (`.`): 13 logical root server IP addresses worldwide.\n- Top-Level Domain (TLD) Nameservers: Manage `.com`, `.org`, `.io`, `.gov`.\n- Authoritative Nameservers: Hold the actual DNS record zone files (A, AAAA, CNAME, MX) for a specific domain.\n\n2. Recursive Query (Client -> Local Resolver):\n- Client asks: 'Give me the IP address for google.com'. Resolver assumes full responsibility to find and return the final IP (or error).\n\n3. Iterative Query (Local Resolver -> DNS Hierarchy):\n- Resolver asks Root: 'Where is google.com?' -> Root replies: 'I don't know, ask `.com` TLD at IP X'.\n- Resolver asks `.com` TLD -> TLD replies: 'Ask Google Authoritative Server at IP Y'.\n- Resolver asks Google Authoritative -> Returns final `A` record IP.",
    keyTalkingPoints: [
      "Hierarchy: Root (.) -> TLD (.com) -> Authoritative Nameserver",
      "Recursive query delegates full resolution responsibility to resolver",
      "Iterative query returns referrals ('I don't know, ask this next server') step-by-step"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "DNS Resolution: Recursive vs Iterative"
  },
  {
    id: 'net-8',
    question: "Explain Subnetting, CIDR (Classless Inter-Domain Routing) notation, and calculate the usable hosts in a /24 subnet.",
    answer: "1. Subnetting & CIDR:\n- Subnetting divides a larger network into smaller, isolated subnetworks for security and broadcast domain management.\n- CIDR notation (e.g. `192.168.1.0/24`) uses `/prefix_length` to specify how many leading bits represent the Network ID, leaving the remaining bits for Host IDs.\n\n2. Calculating Usable Hosts for /24:\n- IPv4 address length = 32 bits.\n- Host bits = `32 - 24 = 8 bits`.\n- Total IP addresses = `2^8 = 256`.\n- Usable Hosts = `2^8 - 2 = 254`.\n\nWhy Subtract 2:\n- 1st address (`192.168.1.0`) is reserved as the Network Address.\n- Last address (`192.168.1.255`) is reserved as the Subnet Broadcast Address.",
    keyTalkingPoints: [
      "CIDR prefix `/N` specifies number of network bits; remaining `32 - N` bits are host bits",
      "Usable hosts formula: `2^(32 - prefix) - 2`",
      "Subtract 2 because first is Network address and last is Broadcast address"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "Subnetting, CIDR & Usable Host Formula"
  },
  {
    id: 'net-9',
    question: "Compare WebSockets, Server-Sent Events (SSE), and HTTP Long Polling for real-time web applications. When should you use which?",
    answer: "1. WebSockets:\n- Full-Duplex (bidirectional) persistent TCP connection upgraded from HTTP via `Upgrade: websocket` header.\n- Ultra-low latency binary and text frames.\n- Best for: Multiplayer games, collaborative whiteboards, bidirectional chat.\n\n2. Server-Sent Events (SSE):\n- Unidirectional (Server -> Client) continuous stream over standard HTTP (`Content-Type: text/event-stream`).\n- Built-in automatic reconnection, event IDs, and works natively through HTTP/2 multiplexing and firewalls.\n- Best for: Stock tickers, real-time dashboards, LLM token streaming (ChatGPT response streams).\n\n3. HTTP Long Polling:\n- Client sends standard HTTP request; server holds request open until new data arrives, responds, and client immediately re-polls.\n- High HTTP header overhead and latency; used strictly as legacy fallback.",
    keyTalkingPoints: [
      "WebSockets: Full-duplex bidirectional TCP stream (Gaming, Interactive Chat)",
      "Server-Sent Events (SSE): Unidirectional Server->Client HTTP stream (LLM Token Streaming, Stock Feeds)",
      "SSE supports automatic reconnection and works seamlessly over HTTP/2"
    ],
    category: "Computer Networks",
    difficulty: "Medium",
    contextTag: "WebSockets vs SSE vs Long Polling"
  },
  {
    id: 'net-10',
    question: "Explain Network Address Translation (NAT) and Port Address Translation (PAT). How do thousands of private devices share a single public IP?",
    answer: "1. Why NAT Exists:\n- IPv4 address space exhaustion (only ~4.3 billion addresses). RFC 1918 defined private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) that are non-routable on the public internet.\n\n2. How PAT (NAPT - Network Address Port Translation) Works:\n- Internal device `192.168.1.50:4500` sends packet to `google.com:443`.\n- NAT Router replaces private source IP with public router IP `203.0.113.1` and assigns a unique source port `50001` in its internal NAT Translation Table.\n- When Google replies to `203.0.113.1:50001`, router inspects table, rewrites destination to `192.168.1.50:4500`, and forwards packet inside LAN.",
    keyTalkingPoints: [
      "NAT/PAT conserves IPv4 space by mapping private IPs to public IPs",
      "PAT multiplexes thousands of private devices across a single public IP using port numbers",
      "NAT Translation Table maps internal `(Private IP, Port)` <-> `(Public IP, Port)`"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "NAT & Port Address Translation (PAT)"
  },
  {
    id: 'net-11',
    question: "Explain WebRTC architecture: How do SDP offer/answer exchanges, STUN servers, TURN relay fallback, and ICE candidate negotiation enable peer-to-peer audio/video streaming through NAT firewalls?",
    answer: "WebRTC enables real-time peer-to-peer (P2P) audio, video, and data streaming directly between web browsers without routing media through a central web server.\n\nConnection Establishment Architecture:\n1. Signaling Phase:\n- Peers exchange connection metadata (Session Description Protocol - SDP) out-of-band via a signaling server (WebSockets/HTTP) describing media codecs, resolutions, and encryption keys.\n\n2. NAT Traversal with STUN (Session Traversal Utilities for NAT):\n- Most devices sit behind private NAT routers. A STUN server discovers the peer's public IP address and port mapping.\n\n3. ICE (Interactive Connectivity Establishment):\n- Gathers all possible network candidates (local LAN IP, STUN reflexive public IP, and relay IP) and tests P2P connectivity to select the lowest-latency route.\n\n4. TURN (Traversal Using Relays around NAT - Fallback):\n- If symmetric NAT firewalls strictly block direct P2P connections, traffic falls back to a TURN relay server that relays encrypted media packets between peers.\n\n5. Media Security (SRTP & DTLS):\n- All WebRTC audio/video streams are end-to-end encrypted using DTLS (Datagram Transport Layer Security) and SRTP (Secure Real-time Transport Protocol).",
    keyTalkingPoints: [
      "Signaling exchanges SDP offer/answer metadata over WebSockets",
      "STUN discovers public IP/port; ICE finds the optimal connectivity path",
      "TURN server acts as guaranteed relay fallback when strict symmetric NAT blocks P2P",
      "Media encrypted end-to-end via DTLS / SRTP"
    ],
    category: "Computer Networks",
    difficulty: "Hard",
    contextTag: "WebRTC, STUN, TURN & NAT Traversal"
  },
  {
    id: 'net-12',
    question: "How does DNS Anycast routing work with BGP to direct user traffic to the geographically nearest Point of Presence (PoP), and how does Global Server Load Balancing (GSLB) handle multi-region failovers?",
    answer: "1. Anycast Routing (BGP Layer 3/4 Routing):\n- Multiple geographically distributed data centers (PoPs) advertise the exact same IP address (e.g. Cloudflare's `1.1.1.1` or Google's `8.8.8.8`) to the internet via Border Gateway Protocol (BGP).\n- Internet Service Providers (ISPs) automatically route packets to the nearest PoP with the shortest AS-Path, minimizing latency and providing inherent DDoS absorption (attack traffic is distributed across global data centers rather than overwhelming one single origin).\n\n2. Global Server Load Balancing (GSLB - Application Layer Routing):\n- Employs intelligent authoritative DNS servers that resolve domain names to different IP addresses based on:\n  a) Geolocation / Client Subnet (EDNS-Client-Subnet) returning the closest regional IP,\n  b) Real-time health checks (if US-East goes down, DNS automatically resolves to US-West within TTL seconds),\n  c) Server capacity and load distribution.",
    keyTalkingPoints: [
      "Anycast advertises the same single IP across global PoPs using BGP shortest-path routing",
      "DDoS mitigation: Anycast diffuses attack volume across global server edges",
      "GSLB uses intelligent DNS resolution with health checks to orchestrate multi-region failovers"
    ],
    category: "Computer Networks",
    difficulty: "Medium",
    contextTag: "Anycast BGP Routing & GSLB"
  },
  {
    id: 'net-13',
    question: "What is an IP Address? Explain the differences between IPv4 and IPv6, and Public vs Private IP addresses.",
    answer: "An IP (Internet Protocol) Address is a unique numerical identifier assigned to every device connected to a computer network.\n\n1. IPv4 vs IPv6:\n- IPv4: 32-bit address written in 4 decimal octets (e.g. `192.168.1.1`). Total address space = `2^32 ≈ 4.3 billion` addresses (exhausted).\n- IPv6: 128-bit address written in 8 hexadecimal blocks (e.g. `2001:0db8:85a3::8a2e:0370:7334`). Total address space = `2^128 ≈ 3.4 * 10^38` addresses (practically infinite, eliminating NAT requirements).\n\n2. Public vs Private IP Addresses:\n- Public IP: Globally unique address assigned by ISP, directly routable across the public internet.\n- Private IP: Local address (e.g. `192.168.x.x`, `10.x.x.x`) used within home/office LANs; non-routable on the internet without NAT.",
    keyTalkingPoints: [
      "IPv4 is 32 bits (4.3B addresses); IPv6 is 128 bits (3.4 * 10^38 addresses)",
      "Public IPs are routable on internet; Private IPs are restricted to local LANs",
      "Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "IPv4 vs IPv6 & Public vs Private IP"
  },
  {
    id: 'net-14',
    question: "What is the difference between a Hub, a Switch, and a Router in computer networking?",
    answer: "1. Hub (Layer 1 - Physical):\n- Non-intelligent repeater: broadcasts incoming data packets to ALL connected ports, creating high network collision domains and security risks.\n\n2. Switch (Layer 2 - Data Link):\n- Intelligent device: maintains a MAC Address Table (`CAM Table`). Forwards data frames ONLY to the specific destination port matching the target MAC address, eliminating collisions.\n\n3. Router (Layer 3 - Network):\n- Connects different network subnets together (e.g. connects your local home LAN to the external Internet WAN). Reads IP packet headers and uses Routing Tables to determine the optimal next-hop path.",
    keyTalkingPoints: [
      "Hub (Layer 1): Broadcasts to all ports (high collisions)",
      "Switch (Layer 2): Forwards frames based on MAC addresses within same LAN",
      "Router (Layer 3): Routes packets based on IP addresses between different networks"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "Hub vs Switch vs Router"
  },
  {
    id: 'net-15',
    question: "What is DNS (Domain Name System) and how does it translate human-readable names to IP addresses?",
    answer: "DNS (Domain Name System) is the 'phonebook of the internet' that translates human-friendly domain names (e.g. `www.google.com`) into computer-routable IP addresses (e.g. `142.250.190.46`).\n\nHow Translation Works:\n1. Client checks local browser and OS DNS cache.\n2. Queries ISP / Recursive DNS Resolver.\n3. Resolver queries Root Nameserver (`.`) -> TLD Nameserver (`.com`) -> Authoritative Nameserver (`google.com`).\n4. Authoritative server returns the `A` record (IPv4) or `AAAA` record (IPv6).\n5. Resolver caches the record for the duration specified by its TTL (Time-To-Live) and returns the IP to the client.",
    keyTalkingPoints: [
      "DNS translates human-readable domain names to numerical IP addresses",
      "Uses hierarchical resolution (Root -> TLD -> Authoritative)",
      "TTL (Time-To-Live) defines caching duration to minimize lookup latency"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "DNS Fundamentals & Name Translation"
  },
  {
    id: 'net-16',
    question: "What is the difference between HTTP and HTTPS? Explain what SSL/TLS certificates do.",
    answer: "1. HTTP (HyperText Transfer Protocol - Port 80):\n- Transmits all data in clear plaintext. Vulnerable to Man-in-the-Middle (MITM) eavesdropping, packet sniffing, and tampering.\n\n2. HTTPS (HTTP Secure - Port 443):\n- HTTP layered over an encrypted SSL/TLS cryptographic tunnel.\n- Provides 3 Core Security Pillars:\n  a) Confidentiality: All requests and responses are encrypted (cannot be read by eavesdroppers).\n  b) Integrity: Cryptographic hashes prevent data from being altered in transit.\n  c) Authentication: SSL/TLS certificate issued by a trusted Certificate Authority (CA) verifies the server's legitimate identity.",
    keyTalkingPoints: [
      "HTTP is plaintext (Port 80); HTTPS is encrypted via SSL/TLS (Port 443)",
      "HTTPS guarantees Confidentiality, Data Integrity, and Server Authentication",
      "Digital certificates issued by trusted CAs prevent phishing and MITM attacks"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "HTTP vs HTTPS & SSL/TLS"
  },
  {
    id: 'net-17',
    question: "What are the standard HTTP Request Methods (GET, POST, PUT, PATCH, DELETE) and explain Idempotency.",
    answer: "Standard HTTP Methods define actions on REST resources:\n1. `GET`: Retrieves resource representation without modifying server state (Safe & Idempotent).\n2. `POST`: Creates a new resource or triggers processing (Not Idempotent: multiple calls create multiple resources).\n3. `PUT`: Completely replaces/updates target resource (Idempotent: calling 10 times produces same result).\n4. `PATCH`: Partially updates specific fields of a resource (May or may not be idempotent).\n5. `DELETE`: Removes the target resource (Idempotent: repeated calls result in resource remaining deleted).\n\nIdempotency Definition: An HTTP method is Idempotent if making multiple identical requests has the exact same intended effect on server state as making a single request.",
    keyTalkingPoints: [
      "GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove)",
      "Idempotent methods (GET, PUT, DELETE) produce identical server state when repeated",
      "POST is non-idempotent (repeated calls create duplicate records)"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "HTTP Methods & Idempotency"
  },
  {
    id: 'net-18',
    question: "What are the 5 major HTTP Status Code categories (1xx, 2xx, 3xx, 4xx, 5xx) and give common examples of each?",
    answer: "HTTP Status codes indicate the result of a client's request:\n\n1. `1xx` Informational: Request received, continuing process (e.g. `101 Switching Protocols` for WebSockets).\n2. `2xx` Success: Action successfully received and processed:\n   - `200 OK`: Standard success response.\n   - `201 Created`: Resource successfully created (POST).\n   - `204 No Content`: Successful action with no response body (DELETE).\n3. `3xx` Redirection: Further action needed to complete request:\n   - `301 Moved Permanently`: Permanent redirect (updates SEO).\n   - `304 Not Modified`: Cached copy is valid (ETag/If-Modified-Since).\n4. `4xx` Client Error: Malformed or invalid request by client:\n   - `400 Bad Request`, `401 Unauthorized` (needs auth), `403 Forbidden` (no permission), `404 Not Found`, `429 Too Many Requests`.\n5. `5xx` Server Error: Server failed to fulfill valid request:\n   - `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`.",
    keyTalkingPoints: [
      "1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, 5xx Server Error",
      "200 OK, 201 Created, 204 No Content",
      "401 Unauthorized (unauthenticated) vs 403 Forbidden (authenticated but unauthorized)",
      "500 Internal Error vs 502/503 Gateway and Unavailable errors"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "HTTP Status Code Categories"
  },
  {
    id: 'net-19',
    question: "What is a Firewall and how does a Packet-Filtering Firewall differ from an Application-Layer (WAF) Firewall?",
    answer: "A Firewall is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules.\n\n1. Packet-Filtering Firewall (Layer 3/4 - Network/Transport):\n- Inspects individual packet headers: Source IP, Destination IP, Source Port, Destination Port, and Protocol (TCP/UDP).\n- Fast with minimal latency, but cannot inspect payload contents.\n\n2. Web Application Firewall (WAF - Layer 7 - Application):\n- Inspects the actual HTTP/HTTPS application payload content.\n- Detects application-layer attacks: SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF, and malicious request bodies.",
    keyTalkingPoints: [
      "Firewalls enforce security boundaries by filtering traffic based on rules",
      "Packet-filtering firewalls inspect IP/Port headers at Layer 3/4",
      "WAF (Layer 7) inspects application payloads to prevent SQLi and XSS attacks"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "Firewalls: Packet-Filtering vs WAF"
  },
  {
    id: 'net-20',
    question: "What is DHCP (Dynamic Host Configuration Protocol) and explain the 4-step DORA process.",
    answer: "DHCP (Dynamic Host Configuration Protocol) is a network management protocol used to automatically assign IP addresses, subnet masks, default gateways, and DNS server IPs to devices joining a network.\n\nThe DORA Process:\n1. D - Discover: Client broadcasts a `DHCPDISCOVER` packet over UDP port 67 looking for available DHCP servers.\n2. O - Offer: DHCP server receives discover and broadcasts a `DHCPOFFER` proposing an unassigned IP address and lease duration.\n3. R - Request: Client broadcasts a `DHCPREQUEST` formally accepting the offered IP address.\n4. A - Acknowledge: Server sends `DHCPACK` confirming the binding and lease.",
    keyTalkingPoints: [
      "DHCP automates dynamic IP address assignment for network devices",
      "DORA steps: Discover -> Offer -> Request -> Acknowledge",
      "Lease time defines how long a device retains its assigned IP address"
    ],
    category: "Computer Networks",
    difficulty: "Easy",
    contextTag: "DHCP & The DORA Process"
  },

  // ==========================================
  // 6. DBMS & DATABASE CONCEPTS (20 Questions)
  // ==========================================
  {
    id: 'dbms-1',
    question: "Explain the ACID properties in database transactions and how relational engines implement Atomicity, Consistency, Isolation, and Durability.",
    answer: "1. Atomicity ('All or Nothing'):\n- All operations within a transaction succeed, or all changes are completely rolled back on error.\n- Implementation: Undo Logs and Write-Ahead Logging (WAL).\n\n2. Consistency:\n- A transaction transitions database from one valid state to another, enforcing all schema constraints, foreign keys, unique rules, and cascade triggers.\n\n3. Isolation:\n- Concurrent transactions execute without interfering with one another or observing intermediate uncommitted states.\n- Implementation: Two-Phase Locking (2PL) and Multi-Version Concurrency Control (MVCC).\n\n4. Durability:\n- Once a transaction commits, its modifications persist permanently, surviving system crashes or power failures.\n- Implementation: WAL flushed sequentially to non-volatile disk via `fsync` before returning commit ACK.",
    keyTalkingPoints: [
      "Atomicity: Rollback via Undo/WAL logs on failure",
      "Consistency: Enforces schema invariants and relational constraints",
      "Isolation: Multi-Version Concurrency Control (MVCC) and transaction locks",
      "Durability: WAL disk flushing (`fsync`) before commit confirmation"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Medium",
    contextTag: "ACID Properties & Engine Implementation"
  },
  {
    id: 'dbms-2',
    question: "Compare Transaction Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable. What concurrency anomalies does each prevent?",
    answer: "Isolation levels manage trade-off between concurrency throughput and data anomalies:\n\n1. Read Uncommitted:\n- Anomalies: Allows Dirty Reads, Non-Repeatable Reads, Phantom Reads.\n\n2. Read Committed (Default in PostgreSQL, Oracle, SQL Server):\n- Prevents: Dirty Reads (transactions read only committed snapshot data).\n- Allows: Non-Repeatable Reads and Phantom Reads.\n\n3. Repeatable Read (Default in MySQL InnoDB):\n- Prevents: Dirty Reads and Non-Repeatable Reads (reading the same row multiple times returns identical values).\n- Allows: Phantom Reads (in standard SQL; InnoDB prevents phantoms via Next-Key Locking).\n\n4. Serializable (Strict Consistency):\n- Prevents: ALL anomalies (Dirty Reads, Non-Repeatable Reads, Phantom Reads, Serialization Anomaly).\n- Implementation: Strict 2PL or Serializable Snapshot Isolation (SSI). Highest lock contention / abort rate.",
    keyTalkingPoints: [
      "Dirty Read: Reading uncommitted data that may roll back",
      "Non-Repeatable Read: Row values change between consecutive reads in same transaction",
      "Phantom Read: New rows matching WHERE condition appear in subsequent range reads",
      "Serializable provides total isolation at cost of highest lock contention"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Hard",
    contextTag: "Transaction Isolation Levels & Anomalies"
  },
  {
    id: 'dbms-3',
    question: "Explain Database Normalization from 1NF to BCNF with concrete rules. When should you intentionally Denormalize a schema?",
    answer: "1. Normalization Forms:\n- 1NF (First Normal Form): Atomic column values (no multi-valued lists), unique column names, and defined Primary Key.\n- 2NF (Second Normal Form): Must be in 1NF + eliminate Partial Dependencies (no non-prime attribute depends on a subset of a composite primary key).\n- 3NF (Third Normal Form): Must be in 2NF + eliminate Transitive Dependencies (`X -> Y` and `Y -> Z`, so non-key attribute cannot determine another non-key attribute).\n- BCNF (Boyce-Codd Normal Form): Stricter 3NF: For every functional dependency `X -> Y`, `X` MUST be a Super Key.\n\n2. When to Denormalize:\n- High Read-to-Write Ratio: In OLAP data warehouses, joining 10 normalized tables creates query latency. Denormalizing into Star/Snowflake schemas pre-computes relationships for fast dashboard reads.",
    keyTalkingPoints: [
      "1NF: Atomic values and primary key",
      "2NF: Eliminates partial dependencies on composite keys",
      "3NF: Eliminates transitive dependencies between non-key columns",
      "Denormalization trades storage redundancy to eliminate expensive multi-table joins in read-heavy systems"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Medium",
    contextTag: "Normalization (1NF-BCNF) vs Denormalization"
  },
  {
    id: 'dbms-4',
    question: "What is the difference between a Clustered Index and a Non-Clustered (Secondary) Index? How does InnoDB organize table data?",
    answer: "1. Clustered Index:\n- Defines physical on-disk sorted order of table rows. Table data rows reside directly inside the leaf nodes of the B+ Tree index.\n- Only ONE Clustered Index allowed per table.\n- In MySQL InnoDB, the Primary Key is always the Clustered Index.\n\n2. Non-Clustered (Secondary) Index:\n- Stored as a separate B+ Tree structure. Leaf nodes contain indexed column values and a pointer (Primary Key value in InnoDB, RowID in PostgreSQL) to the actual clustered table row.\n- Table can have multiple secondary indexes.\n- Secondary lookup requires a two-step traversal ('Bookmark Lookup'): Search secondary B+ Tree -> Search Clustered B+ Tree to retrieve full row.",
    keyTalkingPoints: [
      "Clustered index stores table data directly inside B+ Tree leaf nodes (1 per table)",
      "Secondary index stores key + pointer to clustered index / primary key",
      "Covering indexes satisfy query entirely from secondary index without bookmark lookup"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Medium",
    contextTag: "Clustered vs Secondary Indexes"
  },
  {
    id: 'dbms-5',
    question: "Compare Optimistic Locking versus Pessimistic Locking in database transactions. When should you use which?",
    answer: "1. Pessimistic Locking:\n- Strategy: Assumes concurrent conflicts are frequent. Acquires exclusive database locks on data rows as soon as they are read (`SELECT ... FOR UPDATE`), blocking all concurrent readers/writers until transaction commits.\n- Best for: High-contention financial systems (e.g. banking transfers, ticket booking where overselling must be prevented at all costs).\n\n2. Optimistic Locking:\n- Strategy: Assumes concurrent conflicts are rare. Does not lock rows on read. Adds a `version` integer column or `updated_at` timestamp. On write, validates version: `UPDATE orders SET total = 100, version = version + 1 WHERE id = 1 AND version = 2`.\n- If version changed, update affects 0 rows, prompting application to abort and retry.\n- Best for: High-read, low-write web applications (e-commerce catalog, user profiles).",
    keyTalkingPoints: [
      "Pessimistic locking uses database row locks (`SELECT FOR UPDATE`) to block concurrent access",
      "Optimistic locking uses application version columns and validates at commit time",
      "Pessimistic for high-contention banking/booking; Optimistic for high-throughput web reads"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Medium",
    contextTag: "Optimistic vs Pessimistic Locking"
  },
  {
    id: 'dbms-6',
    question: "Compare SQL (Relational) versus NoSQL databases across Schema, Scaling, ACID guarantees, and CAP theorem trade-offs.",
    answer: "1. SQL (RDBMS - PostgreSQL, MySQL):\n- Schema: Rigid structured relational tables with predefined data types.\n- Scaling: Vertical scaling (scale up CPU/RAM). Horizontal scaling requires sharding.\n- ACID: Strong ACID compliance.\n- Best for: Complex multi-table joins, financial ledgers, transactional consistency.\n\n2. NoSQL (Document: MongoDB, Key-Value: Redis, Columnar: Cassandra, Graph: Neo4j):\n- Schema: Dynamic, unstructured or semi-structured (JSON/BSON, key-value pairs).\n- Scaling: Native horizontal scaling (scale out across commodity nodes via auto-sharding and partitioning).\n- ACID: Traditionally BASE (Basically Available, Soft state, Eventual consistency).\n- Best for: High write throughput, unstructured event streaming, fast caching, dynamic document catalogs.",
    keyTalkingPoints: [
      "SQL enforces structured schemas, ACID guarantees, and relational joins",
      "NoSQL provides dynamic schema, horizontal sharding, and high throughput",
      "CAP Theorem: SQL prioritizes Consistency (CP); NoSQL often prioritizes Availability (AP)"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Easy",
    contextTag: "SQL vs NoSQL Architecture"
  },
  {
    id: 'dbms-7',
    question: "What is Database Sharding? Compare Horizontal Partitioning, Range-Based Sharding, and Hash-Based Consistent Sharding.",
    answer: "Database Sharding is a horizontal partitioning technique that splits large database tables across multiple independent physical database servers (shards).\n\nSharding Strategies:\n1. Range-Based Sharding: Partition keys divided into contiguous ranges (e.g. Shard 1: User IDs 1-1M, Shard 2: 1M-2M).\n   - Problem: Creates Hotspotting (recent active users concentrated on newest shard).\n2. Hash-Based Sharding: Apply hash function to shard key (`hash(user_id) % num_shards`). Distributes records uniformly across all shards.\n   - Problem: Adding a new shard requires rehashing and migrating nearly all data.\n3. Consistent Hashing: Maps both shards and keys onto a virtual ring (0 to 2^32 - 1). Adding/removing a shard moves only `K / N` keys, enabling dynamic scaling.\n\nChallenges of Sharding: Cross-shard joins are impossible without distributed query engines; multi-shard transactions require 2PC.",
    keyTalkingPoints: [
      "Sharding partitions datasets horizontally across multiple independent servers",
      "Consistent Hashing minimizes data migration during cluster scale-out",
      "Drawbacks: Cross-shard joins and distributed transactions introduce latency"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Hard",
    contextTag: "Database Sharding & Consistent Hashing"
  },
  {
    id: 'dbms-8',
    question: "What is Database Replication Lag in Master-Slave configurations? How do you solve the 'Read-Your-Own-Writes' consistency problem?",
    answer: "1. Replication Lag:\n- In Master-Slave (Primary-Replica) topologies, all writes go to the Primary and are asynchronously streamed via binary logs to Read Replicas.\n- Replication Lag is the delay (milliseconds to seconds) before a Replica applies those changes.\n\n2. The Read-Your-Own-Writes Problem:\n- User updates profile on Primary -> User immediately refreshes page -> Read query routed to Read Replica that hasn't received update yet -> User sees stale data.\n\nSolutions:\n1. User-Pinned Routing: Route reads to Primary for X seconds (e.g. 5 seconds) after a user performs a write operation.\n2. Version / GTID Tracking: Pass Global Transaction ID (GTID) with client session; ensure replica has caught up to GTID before serving read.\n3. Synchronous Replication: Primary waits for at least one replica ACK before committing (trade-off: increases write latency).",
    keyTalkingPoints: [
      "Asynchronous replication creates a latency lag between Primary and Read Replicas",
      "Causes stale reads when users read from replicas immediately after writing",
      "Resolved via Session-based Primary routing or GTID transaction tracking"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Hard",
    contextTag: "Replication Lag & Read-Your-Own-Writes"
  },
  {
    id: 'dbms-9',
    question: "Explain Write-Ahead Logging (WAL) and Checkpointing. How does a database recover from a sudden power failure or server crash?",
    answer: "1. Write-Ahead Logging (WAL):\n- Fundamental principle: Any modification to a data page in RAM must be written and flushed to the sequential WAL log on non-volatile disk BEFORE the actual data page is written to table files.\n- Sequential disk writes are fast (orders of magnitude faster than random table writes).\n\n2. Checkpointing:\n- Periodically flushes all dirty in-memory data pages to table disk files and writes a Checkpoint record to WAL.\n\n3. Crash Recovery Flow (ARIES Protocol):\n1. Analysis Phase: Scan WAL forward from last checkpoint to determine dirty pages and active in-flight transactions at crash time.\n2. Redo Phase: Replay all logged actions from checkpoint to restore database to exact state before crash.\n3. Undo Phase: Reverse (roll back) all uncommitted transactions active at crash time using Undo logs.",
    keyTalkingPoints: [
      "WAL guarantees durability by logging operations sequentially before table data writes",
      "Checkpoints flush dirty RAM pages to disk and prune old WAL log segments",
      "ARIES crash recovery uses Analysis, Redo (replay committed), and Undo (rollback active)"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Hard",
    contextTag: "Write-Ahead Logging (WAL) & Crash Recovery"
  },
  {
    id: 'dbms-10',
    question: "What is Database Connection Pooling (e.g. HikariCP, PgBouncer)? How do you calculate optimal connection pool size?",
    answer: "1. Connection Pooling:\n- Establishing a database connection requires a costly TCP 3-way handshake, TLS negotiation, authentication, and backend process memory allocation (~2-10MB RAM per connection in PostgreSQL).\n- A Connection Pool maintains a warm cache of reusable open connections. Threads borrow a connection, execute queries, and return it to pool.\n\n2. Optimal Pool Sizing Formula (PostgreSQL / HikariCP benchmark):\n`pool_size = (core_count * 2) + effective_spindle_count`\n(e.g. A 4-core server with SSD storage needs only ~9-10 connections).\n\nWhy Smaller Pools are Faster:\nWhen 1,000 threads compete for 1,000 DB connections on a 16-core CPU, the database spends 90% of CPU time thrashing on OS context switches and disk I/O queue lock contention. A tuned pool of 32 connections queues requests cleanly, keeping CPU cache warm and maximizing throughput.",
    keyTalkingPoints: [
      "Connection pooling eliminates repeated TCP/TLS and backend process allocation overhead",
      "Optimal pool formula: `(CPU cores * 2) + spindle_count`",
      "Small connection pools prevent database CPU thrashing and lock contention"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Medium",
    contextTag: "Connection Pooling & Sizing Formulas"
  },
  {
    id: 'dbms-11',
    question: "How is image/binary file data stored in MySQL versus MongoDB? Compare BLOBs vs Object Storage (AWS S3) with database URL pointers, and explain MongoDB GridFS vs BSON limits.",
    answer: "There are two architectural paradigms for storing binary files (images, PDFs, videos):\n\n1. Storing Directly Inside the Database:\n- MySQL: Uses BLOB types (TINYBLOB, BLOB, MEDIUMBLOB up to 16MB, LONGBLOB up to 4GB). Storing large BLOBs in MySQL degrades performance because it bloats database buffer pool cache, increases backup/restore times, and locks tables during large I/O transfers.\n- MongoDB: Standard documents have a hard 16MB BSON size limit. For files larger than 16MB (or large image catalogs), MongoDB provides GridFS, which splits files into contiguous chunks (default 255KB each) across two collections: `fs.files` (metadata) and `fs.chunks` (binary bytes).\n\n2. Industry Best Practice (Object Storage + DB Pointers):\n- Store the actual binary file in dedicated Cloud Object Storage (e.g. AWS S3, Cloudflare R2, Google Cloud Storage) and store only the secure CDN/S3 URL string (`VARCHAR(2048)` in MySQL or string field in MongoDB) in the database.\n- Advantages: S3 provides 99.999999999% (11 9's) durability, global edge CDN caching via CloudFront, offloads database bandwidth, and costs a fraction of database disk storage.",
    keyTalkingPoints: [
      "MySQL BLOB types (up to LONGBLOB 4GB) cause database buffer pool bloat and slow backups",
      "MongoDB enforces 16MB BSON limit; uses GridFS (255KB chunking) for larger files",
      "Industry Best Practice: Store binary assets in AWS S3 / Cloudflare R2 and store CDN URL strings in the database"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Medium",
    contextTag: "Image Storage: MySQL vs MongoDB vs S3"
  },
  {
    id: 'dbms-12',
    question: "How do Log-Structured Merge-Trees (LSM-Trees) compare to B-Trees in database storage engines (e.g. Cassandra / RocksDB vs PostgreSQL / MySQL)?",
    answer: "B-Trees and LSM-Trees represent the two dominant storage architectures in modern databases with fundamentally different trade-offs:\n\n1. B-Trees (In-Place Updates - Optimized for Reads):\n- Used by: PostgreSQL, MySQL (InnoDB), SQLite, Oracle.\n- Mechanism: Modifies disk pages in-place. Random writes require seeking on disk, leading to high write amplification.\n- Read Performance: Excellent O(log N) point reads since data resides in a predictable leaf node.\n- Write Performance: Slower for write-heavy workloads due to random disk I/O and page splits.\n\n2. LSM-Trees (Append-Only - Optimized for Writes):\n- Used by: Apache Cassandra, RocksDB, Google Bigtable, ScyllaDB, LevelDB.\n- Mechanism: Writes are appended sequentially to an in-memory sorted buffer called a MemTable (backed by a Write-Ahead Log). When full, the MemTable is flushed to disk as an immutable sorted file (SSTable - Sorted String Table). Periodic Compaction merges and deduplicates SSTables in the background.\n- Write Performance: Phenomenal throughput because all writes are sequential in-memory / sequential append (no random seeks).\n- Read Performance: Slower point reads because a key might exist in the MemTable or across multiple SSTable layers on disk (mitigated using Bloom Filters).",
    keyTalkingPoints: [
      "B-Trees: In-place updates, superior read latency, high random write overhead",
      "LSM-Trees: Append-only MemTable + immutable SSTables, ultra-fast sequential writes",
      "LSM uses Bloom Filters and background Compaction to accelerate read performance"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Hard",
    contextTag: "LSM-Trees vs B-Trees Storage Engines"
  },
  {
    id: 'dbms-13',
    question: "Explain Distributed Transactions: How does the Two-Phase Commit (2PC) protocol work, what are its blocking vulnerabilities, and how does the SAGA pattern provide an eventual consistency alternative?",
    answer: "Managing transactions across distributed microservices cannot use simple local ACID locks. Two architectural patterns address this:\n\n1. Two-Phase Commit (2PC - Strong Consistency):\n- Components: A Coordinator node and multiple Participant resource managers (databases).\n- Phase 1 (Prepare): Coordinator asks all participants: 'Can you commit?' Participants acquire local locks, execute write to WAL, and reply VOTE_COMMIT or VOTE_ABORT.\n- Phase 2 (Commit): If ALL voted yes, coordinator logs COMMIT and sends GLOBAL_COMMIT to all. If any voted no, sends GLOBAL_ABORT.\n- Critical Flaw: 2PC is a blocking protocol. If the coordinator crashes after Phase 1, participants hold locks indefinitely, causing resource exhaustion.\n\n2. SAGA Pattern (Eventual Consistency - High Availability):\n- Breaks a distributed transaction into a sequence of local transactions across microservices. Each service executes its local transaction and publishes an event.\n- Compensating Transactions: If a step fails (e.g. Payment fails after Inventory was reserved), the Saga orchestrator or event bus triggers Compensating Transactions (rollback actions in reverse order) to undo previous steps.\n- Models: Choreography (services react to domain events) vs Orchestration (a central orchestrator service commands each step).",
    keyTalkingPoints: [
      "2PC enforces strong consistency but suffers from blocking coordinator failure and high latency",
      "SAGA decomposes distributed transactions into local steps with Compensating Transactions (Undo actions)",
      "SAGA Choreography (decentralized event-driven) vs Orchestration (central workflow state machine)"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Hard",
    contextTag: "2PC vs SAGA Distributed Transactions"
  },
  {
    id: 'dbms-14',
    question: "What is a DBMS and what is an RDBMS? Explain Tables, Rows (Tuples), and Columns (Attributes).",
    answer: "1. DBMS (Database Management System):\n- Software used to store, manage, and retrieve data (can store data as files, hierarchies, or documents).\n\n2. RDBMS (Relational Database Management System):\n- An advanced DBMS based on the Relational Model introduced by E.F. Codd.\n- Stores data in structured 2-dimensional Tables (Relations) linked by relationships (Foreign Keys).\n- Examples: MySQL, PostgreSQL, Oracle, SQLite, SQL Server.\n\nCore Relational Components:\n- Table (Relation): A collection of related data organized in rows and columns.\n- Row (Tuple / Record): Represents a single, complete data entry entity.\n- Column (Attribute / Field): Represents a specific property or data characteristic with a defined data type.",
    keyTalkingPoints: [
      "DBMS is general data storage; RDBMS organizes data into relational tables",
      "Table = Relation, Row = Tuple (single record), Column = Attribute (field)",
      "RDBMS enforces data integrity via primary and foreign key constraints"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Easy",
    contextTag: "DBMS vs RDBMS & Core Components"
  },
  {
    id: 'dbms-15',
    question: "What is a Primary Key, Foreign Key, and Candidate Key? Explain Referential Integrity.",
    answer: "1. Candidate Key: A set of one or more columns that can uniquely identify a row in a table. A table can have multiple candidate keys.\n2. Primary Key: The single candidate key chosen by database designer to uniquely identify each row. Must be unique and cannot contain NULL.\n3. Foreign Key: A column (or set of columns) in one table that references the Primary Key of another table, creating a relational link.\n\nReferential Integrity:\n- A database rule guaranteeing that relationships between tables remain consistent.\n- Ensures a Foreign Key value must match an existing Primary Key value in the referenced table (or be NULL), preventing orphan records.",
    keyTalkingPoints: [
      "Candidate Keys are all unique identifiers; Primary Key is the chosen master identifier",
      "Foreign Key references the Primary Key of another table to link records",
      "Referential Integrity prevents orphan records and broken relationships"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Easy",
    contextTag: "Keys & Referential Integrity"
  },
  {
    id: 'dbms-16',
    question: "What is Database Normalization and explain 1NF, 2NF, and 3NF in simple terms for freshers.",
    answer: "Database Normalization is the process of organizing database tables to reduce data redundancy and eliminate insert, update, and delete anomalies.\n\nSimple Summary of Normal Forms:\n1. 1NF (First Normal Form):\n   - Each table column must contain atomic (single, indivisible) values (no comma-separated lists).\n   - Each row must be uniquely identifiable with a Primary Key.\n2. 2NF (Second Normal Form):\n   - Must be in 1NF.\n   - No Partial Dependency: Every non-key column must depend on the FULL primary key (applies when primary key is composite).\n3. 3NF (Third Normal Form):\n   - Must be in 2NF.\n   - No Transitive Dependency: Non-key columns must NOT depend on other non-key columns (`A -> B -> C`).",
    keyTalkingPoints: [
      "Normalization eliminates data redundancy and anomalies (Insert, Update, Delete)",
      "1NF: Atomic values; 2NF: No partial composite key dependencies",
      "3NF: No transitive dependencies (non-key attributes depend only on the primary key)"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Easy",
    contextTag: "Database Normalization (1NF, 2NF, 3NF)"
  },
  {
    id: 'dbms-17',
    question: "What are DDL, DML, DCL, and TCL commands in SQL? Give common examples of each.",
    answer: "SQL commands are categorized by their operational purpose:\n\n1. DDL (Data Definition Language):\n- Defines and modifies database structure/schema.\n- Commands: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME`.\n\n2. DML (Data Manipulation Language):\n- Manages and queries data records inside tables.\n- Commands: `SELECT`, `INSERT`, `UPDATE`, `DELETE`.\n\n3. DCL (Data Control Language):\n- Manages permissions and security privileges.\n- Commands: `GRANT` (give access), `REVOKE` (remove access).\n\n4. TCL (Transaction Control Language):\n- Manages transactional execution and rollback.\n- Commands: `COMMIT` (save permanently), `ROLLBACK` (undo changes), `SAVEPOINT`.",
    keyTalkingPoints: [
      "DDL: Schema definition (CREATE, ALTER, DROP, TRUNCATE)",
      "DML: Data management (SELECT, INSERT, UPDATE, DELETE)",
      "DCL: Permissions (GRANT, REVOKE)",
      "TCL: Transactions (COMMIT, ROLLBACK, SAVEPOINT)"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Easy",
    contextTag: "SQL Sublanguages: DDL, DML, DCL, TCL"
  },
  {
    id: 'dbms-18',
    question: "What is the difference between a Clustered Index and a Non-Clustered Index in simple terms?",
    answer: "Think of an index like a textbook:\n\n1. Clustered Index (Like Chapter Numbering / Page Order):\n- The physical contents of the book are arranged sequentially in chapter order.\n- A table can have only ONE Clustered Index because data rows can only be sorted in one physical sequence on disk.\n\n2. Non-Clustered Index (Like the Index at the Back of a Book):\n- A separate lookup structure that lists keywords alphabetically with page numbers (pointers) pointing to where the topic is located in the book.\n- A table can have MULTIPLE Non-Clustered Indexes.",
    keyTalkingPoints: [
      "Clustered index physically sorts and stores the actual table data rows (1 per table)",
      "Non-Clustered index is a separate index with pointers to table rows (multiple per table)",
      "Clustered index lookup is faster because it avoids pointer hops"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Easy",
    contextTag: "Clustered vs Non-Clustered Index Analogy"
  },
  {
    id: 'dbms-19',
    question: "What is a Database Trigger in SQL, and when are BEFORE vs AFTER triggers executed?",
    answer: "A Database Trigger is a stored procedural program that automatically executes ('fires') in response to a specific event (such as `INSERT`, `UPDATE`, or `DELETE`) on a particular table.\n\nTrigger Timing:\n1. BEFORE Trigger: Fires before the data modification is written to the table. Used for validating input data, normalizing strings, or calculating derived columns.\n2. AFTER Trigger: Fires after the data modification has been successfully committed to the table. Used for audit logging, updating summary counters in another table, or emitting notification events.",
    keyTalkingPoints: [
      "Triggers execute automatically upon INSERT, UPDATE, or DELETE events",
      "BEFORE triggers validate and sanitize data before insertion",
      "AFTER triggers perform audit logging and cross-table synchronization"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Easy",
    contextTag: "Database Triggers (BEFORE & AFTER)"
  },
  {
    id: 'dbms-20',
    question: "What is a Stored Procedure in SQL, and what are its advantages over ad-hoc client SQL queries?",
    answer: "A Stored Procedure is a pre-compiled collection of one or more SQL statements stored in the database that can be executed as a reusable subroutine (`CALL GetCustomerOrders(101)`).\n\nAdvantages:\n1. Faster Execution: Pre-compiled and parsed once; query execution plan is cached in database memory.\n2. Reduced Network Traffic: Client sends only procedure name and parameters (`CALL proc(1)`) rather than sending multi-line SQL strings.\n3. Security & SQL Injection Prevention: Enforces parameterized queries and restricts direct table access permissions.\n4. Code Reusability & Maintainability: Centralizes complex business and calculation logic inside the database.",
    keyTalkingPoints: [
      "Stored procedures are pre-compiled and cached for faster execution",
      "Reduces network bandwidth between application and database servers",
      "Enhances security through parameterized inputs and permission isolation"
    ],
    category: "DBMS & Database Concepts",
    difficulty: "Easy",
    contextTag: "Stored Procedures & Advantages"
  },

  // ==========================================
  // 7. MACHINE LEARNING & AI (20 Questions)
  // ==========================================
  {
    id: 'ml-1',
    question: "Compare Supervised Learning, Unsupervised Learning, and Reinforcement Learning paradigms with core algorithms and real-world applications.",
    answer: "1. Supervised Learning:\n- Data: Labeled input-output pairs `(X, y)`.\n- Goal: Learn mapping function `f(X) -> y`.\n- Tasks: Classification (Spam detection, image labeling) and Regression (House price prediction, stock forecasting).\n- Algorithms: Linear/Logistic Regression, Random Forest, XGBoost, Neural Networks.\n\n2. Unsupervised Learning:\n- Data: Unlabeled data `(X)`.\n- Goal: Discover hidden patterns, clusters, or lower-dimensional representations.\n- Tasks: Clustering (Customer market segmentation) and Dimensionality Reduction (PCA, t-SNE, anomaly detection).\n- Algorithms: K-Means, DBSCAN, Hierarchical Clustering, Autoencoders.\n\n3. Reinforcement Learning (RL):\n- Paradigm: An Agent interacts with an Environment in discrete time steps, observing State `S`, taking Action `A`, receiving Reward `R`, and transitioning to Next State `S'`.\n- Goal: Maximize cumulative expected future reward using a Policy `pi(A|S)`.\n- Algorithms: Q-Learning, Deep Q-Networks (DQN), PPO (Proximal Policy Optimization used in RLHF for LLMs).\n- Applications: Robotics, autonomous driving, chess/Go (AlphaGo), and game playing.",
    keyTalkingPoints: [
      "Supervised uses labeled data for Classification and Regression",
      "Unsupervised finds patterns in unlabeled data via Clustering and PCA",
      "Reinforcement Learning trains an agent to maximize rewards in an environment"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "Supervised vs Unsupervised vs RL"
  },
  {
    id: 'ml-2',
    question: "Explain the Bias-Variance Tradeoff. How do you diagnose high bias (underfitting) versus high variance (overfitting) from learning curves, and how do you resolve each?",
    answer: "Total Generalization Error = `Bias^2 + Variance + Irreducible Error`.\n\n1. High Bias (Underfitting):\n- Model is too simple to capture underlying data patterns (e.g. fitting linear line to quadratic data).\n- Symptoms: High Training Error AND High Validation Error.\n- Solutions: Increase model complexity (deeper trees/neural nets), add polynomial features, reduce regularization penalties.\n\n2. High Variance (Overfitting):\n- Model is overly complex and memorizes noise/fluctuations in training data rather than generalizing.\n- Symptoms: Low Training Error BUT High Validation/Test Error (large generalization gap).\n- Solutions: Add L1/L2 Regularization, Dropout, early stopping, gather more training data, or simplify feature set.",
    keyTalkingPoints: [
      "High Bias = Underfitting (High training and validation error)",
      "High Variance = Overfitting (Low training error, high validation error)",
      "Regularization, Dropout, and more training data reduce variance"
    ],
    category: "Machine Learning & AI",
    difficulty: "Medium",
    contextTag: "Bias-Variance Tradeoff & Diagnostics"
  },
  {
    id: 'ml-3',
    question: "Compare L1 (Lasso) and L2 (Ridge) Regularization mathematically. Why does L1 regularization drive weights to absolute zero for feature selection?",
    answer: "Regularization adds a penalty term to the loss function to prevent overfitting:\n- L1 Regularization (Lasso): Loss = `MSE + lambda * sum(|w_i|)`\n- L2 Regularization (Ridge): Loss = `MSE + lambda * sum(w_i^2)`\n\nGeometric Intuition for L1 Sparsity:\n- L1 penalty creates a diamond-shaped constraint region with sharp corners on the coordinate axes.\n- L2 penalty creates a smooth circular/spherical constraint region.\n- When the elliptical contours of the unregularized loss touch the constraint boundary, they are mathematically far more likely to intersect at the sharp corners of the L1 diamond (where one or more coordinate weights `w_i = 0`).\n- Hence, L1 acts as an automatic feature selection mechanism.",
    keyTalkingPoints: [
      "L1 (Lasso) uses absolute weights sum; L2 (Ridge) uses squared weights sum",
      "L1 drives irrelevant feature weights to exact zero (sparse feature selection)",
      "L2 shrinks all weights toward zero without setting them exactly to zero"
    ],
    category: "Machine Learning & AI",
    difficulty: "Medium",
    contextTag: "L1 Lasso vs L2 Ridge Regularization"
  },
  {
    id: 'ml-4',
    question: "Explain Precision, Recall, F1-Score, and ROC-AUC. When is Recall critical over Precision (e.g. Cancer detection, Fraud detection)?",
    answer: "Confusion Matrix Metrics:\n1. Precision = `TP / (TP + FP)`: Of all positive predictions, how many were actually positive? (Minimizes False Positives).\n2. Recall (Sensitivity) = `TP / (TP + FN)`: Of all actual positive cases, how many did the model correctly catch? (Minimizes False Negatives).\n3. F1-Score = `2 * (Precision * Recall) / (Precision + Recall)`: Harmonic mean balancing Precision and Recall.\n4. ROC-AUC: Area under the True Positive Rate vs False Positive Rate curve across all classification thresholds.\n\nWhen Recall is Critical:\nIn Medical Cancer Diagnosis or Fraud Detection, a False Negative (missing a patient with cancer) is catastrophic or fatal. You tune the threshold to maximize Recall (even if it causes extra False Positives requiring follow-up tests).",
    keyTalkingPoints: [
      "Precision: Minimizes False Positives (`TP / (TP + FP)`)",
      "Recall: Minimizes False Negatives (`TP / (TP + FN)`)",
      "Healthcare/Fraud prioritizes High Recall to avoid missing critical positive cases"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "Precision, Recall, F1 & ROC-AUC"
  },
  {
    id: 'ml-5',
    question: "Explain the Self-Attention mechanism in Transformer architectures. How do Query (Q), Key (K), and Value (V) matrices compute contextual embeddings?",
    answer: "Self-Attention allows a model to weigh the relevance of all tokens in a sequence when computing the representation of a specific token, capturing long-range dependencies in O(1) path length.\n\nMathematical Formula:\n`Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V`\n\nStep-by-Step Breakdown:\n1. Projections: Input embedding `X` is multiplied by learnable weight matrices to produce Query `Q = X * W_q`, Key `K = X * W_k`, and Value `V = X * W_v`.\n2. Dot-Product Similarity: `Q * K^T` calculates pairwise alignment scores between every token and every other token.\n3. Scaling: Divided by `sqrt(d_k)` to prevent dot products from growing excessively large in high dimensions, which would cause softmax gradients to vanish.\n4. Softmax: Converts similarity scores into a normalized probability distribution (attention weights summing to 1).\n5. Weighted Sum: Multiplies attention weights by Value matrix `V` to output contextualized token representations.",
    keyTalkingPoints: [
      "Formula: `softmax((Q * K^T) / sqrt(d_k)) * V`",
      "Query asks for information; Key advertises relevance; Value holds the payload data",
      "Scaling factor `sqrt(d_k)` prevents vanishing gradients during softmax in high dimensions"
    ],
    category: "Machine Learning & AI",
    difficulty: "Hard",
    contextTag: "Transformer Self-Attention Mechanism"
  },
  {
    id: 'ml-6',
    question: "Explain the complete architecture of a Retrieval-Augmented Generation (RAG) pipeline for Large Language Models.",
    answer: "RAG combines external knowledge retrieval with LLM generation to eliminate hallucinations and incorporate proprietary up-to-date documentation:\n\n1. Ingestion Phase (Offline):\n- Document Chunking: Split documents into semantically coherent text chunks (e.g. 500 tokens with 50-token overlap).\n- Embedding Generation: Pass chunks through an embedding model to generate dense mathematical vectors.\n- Vector Database Storage: Store embeddings and metadata in vector DB (Pinecone, Qdrant, pgvector) with HNSW indexing.\n\n2. Retrieval & Generation Phase (Online Query):\n- User submits query -> Query converted to embedding vector.\n- Vector DB performs Approximate Nearest Neighbor (ANN) search using Cosine Similarity to retrieve Top-K relevant chunks.\n- Prompt Augmentation: System prompt combines User Query + Retrieved Chunks + Instructions ('Answer strictly based on provided context').\n- LLM outputs grounded, factual response with document source citations.",
    keyTalkingPoints: [
      "Ingestion: Document chunking -> Embedding model -> Vector Database indexing",
      "Retrieval: Query embedding -> Vector similarity search (Cosine/HNSW) -> Top-K chunks",
      "Generation: Injects retrieved chunks into LLM context window to prevent hallucinations"
    ],
    category: "Machine Learning & AI",
    difficulty: "Medium",
    contextTag: "RAG Pipeline Architecture"
  },
  {
    id: 'ml-7',
    question: "Compare Bagging (e.g. Random Forest) and Boosting (e.g. XGBoost, LightGBM, CatBoost) ensemble learning techniques.",
    answer: "1. Bagging (Bootstrap Aggregating - e.g. Random Forest):\n- Training: Trains multiple independent deep decision trees in PARALLEL on random bootstrap sub-samples of data with feature bagging.\n- Aggregation: Averages predictions (regression) or majority vote (classification).\n- Primary Goal: Variance Reduction (prevents overfitting of complex individual trees).\n\n2. Boosting (e.g. Gradient Boosting, XGBoost, LightGBM):\n- Training: Trains shallow decision trees SEQUENTIALLY. Each subsequent tree is trained to correct the residual errors made by previous trees using gradient descent on the loss function.\n- Aggregation: Weighted sum of all sequential tree predictions.\n- Primary Goal: Bias Reduction (turns weak learners into strong predictive models).",
    keyTalkingPoints: [
      "Bagging builds independent trees in parallel to reduce Variance (Random Forest)",
      "Boosting builds sequential trees iteratively correcting residual errors to reduce Bias (XGBoost)",
      "Bagging is fast/parallelizable; Boosting achieves higher competitive accuracy"
    ],
    category: "Machine Learning & AI",
    difficulty: "Medium",
    contextTag: "Bagging vs Boosting"
  },
  {
    id: 'ml-8',
    question: "Explain the Adam Optimizer. How does it combine Momentum and RMSProp for training deep neural networks?",
    answer: "Adam (Adaptive Moment Estimation) is an adaptive learning rate optimization algorithm combining the benefits of two methods:\n\n1. Momentum (First Moment Estimate):\n- Computes exponentially decaying average of past gradients (`m_t = beta1 * m_{t-1} + (1 - beta1) * g_t`).\n- Smooths out noisy oscillations and accelerates gradient descent in the relevant direction.\n\n2. RMSProp (Second Moment Estimate):\n- Computes exponentially decaying average of past squared gradients (`v_t = beta2 * v_{t-1} + (1 - beta2) * g_t^2`).\n- Scales learning rate inversely with gradient magnitude: frequently updated weights receive smaller steps, while rare/sparse weights receive larger updates.\n\n3. Bias Correction:\n- Corrects initial bias towards zero during early training steps: `m_hat = m_t / (1 - beta1^t)`, `v_hat = v_t / (1 - beta2^t)`.\n- Parameter update: `w = w - (alpha / (sqrt(v_hat) + epsilon)) * m_hat`.",
    keyTalkingPoints: [
      "Combines Momentum (1st moment: directional velocity) and RMSProp (2nd moment: adaptive scaling)",
      "Includes bias correction to prevent under-stepping during early initialization iterations",
      "Default optimizer of choice for modern deep learning and Transformer training"
    ],
    category: "Machine Learning & AI",
    difficulty: "Hard",
    contextTag: "Adam Optimization Algorithm"
  },
  {
    id: 'ml-9',
    question: "Explain K-Fold Cross-Validation. What is Data Leakage, and how do you prevent it during feature engineering and scaling?",
    answer: "1. K-Fold Cross-Validation:\n- The training dataset is randomly partitioned into K equal folds (typically K=5 or 10).\n- The model is trained on K-1 folds and validated on the remaining 1 fold. This process repeats K times so every fold acts as the test set once. Results are averaged to provide an unbiased estimate of generalization performance.\n- Stratified K-Fold: Ensures each fold preserves the original class distribution ratio (essential for imbalanced classification).\n\n2. Data Leakage:\n- Occurs when information from outside the training dataset (such as the validation or test set) is inadvertently used to train the model, producing artificially inflated test scores that fail in production.\n\nHow to Prevent Data Leakage:\n- Fit data transformations (e.g. `StandardScaler`, imputation, PCA, target encoding) ONLY on the training fold, then transform validation/test folds without refitting.\n- Use `sklearn.pipeline.Pipeline` to encapsulate preprocessing and model fitting inside cross-validation loops.",
    keyTalkingPoints: [
      "K-Fold CV provides robust performance metrics by validating across all partitioned data subsets",
      "Stratified K-Fold maintains target class distribution ratios in each fold",
      "Prevent data leakage by fitting scalers and encoders strictly inside training folds via ML pipelines"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "Cross-Validation & Data Leakage"
  },
  {
    id: 'ml-10',
    question: "How do you mitigate Hallucinations in Large Language Models (LLMs)? Explain Guardrails, Chain-of-Thought (CoT), and Temperature tuning.",
    answer: "LLM Hallucinations occur when a model generates convincing but factually incorrect or ungrounded claims due to probabilistic next-token generation.\n\nMitigation Techniques:\n1. Temperature & Top-P Tuning: Lowering temperature (e.g. `temperature = 0.0` or `0.2`) forces the model to choose high-probability deterministic tokens, minimizing creative hallucinations.\n\n2. Grounded RAG (Retrieval-Augmented Generation): Provide verified reference documents in the system prompt and instruct the model to respond strictly using citation citations.\n\n3. Chain-of-Thought (CoT) Prompting: Asking the model to 'Think step-by-step' forces it to output intermediate reasoning steps before arriving at a final answer, improving logical consistency.\n\n4. Schema Enforcement & Guardrails: Use tools like Pydantic, Instructor, or NeMo Guardrails to constrain LLM outputs to rigid JSON schemas, validating constraints at runtime.",
    keyTalkingPoints: [
      "Set temperature to 0.0 - 0.2 for deterministic factual output",
      "Grounded RAG injects verified source documents into context",
      "Chain-of-Thought ('Think step-by-step') reduces logical reasoning errors",
      "Apply schema validators (Pydantic / Guardrails) to enforce verifiable output schemas"
    ],
    category: "Machine Learning & AI",
    difficulty: "Medium",
    contextTag: "LLM Hallucinations & Guardrails"
  },
  {
    id: 'ml-11',
    question: "What is Agentic AI? Explain Autonomous AI Agents, the ReAct (Reason + Act) loop, Tool Calling, Planning, Memory systems, and the Model Context Protocol (MCP).",
    answer: "Agentic AI refers to autonomous systems where Large Language Models (LLMs) act as proactive decision-making reasoning engines rather than passive text generators. Agents independently plan, execute actions using external tools, observe outcomes, self-correct, and iterate toward a high-level goal.\n\nCore Pillars of Agentic AI:\n1. The ReAct Loop (Reasoning + Action):\n- The agent follows a cyclic loop: Thought (analyze current state) -> Action (choose a tool and parameters) -> Observation (read tool output / environment feedback) -> Repeat until goal completion.\n\n2. Tool Calling & Function Execution:\n- The model is provided structured JSON schemas of available tools (e.g. database query, web search, code executor, API call). The model outputs structured arguments to invoke tools and consumes their returned payloads.\n\n3. Planning & Decomposition:\n- Break complex goals into multi-step execution plans (e.g. Plan-and-Solve, Tree of Thoughts) and dynamically re-plan if a sub-step fails.\n\n4. Memory Architecture:\n- Short-term Memory: Conversation context window.\n- Long-term Memory: Vector Databases (RAG) storing past user preferences, episodic task history, and semantic knowledge.\n\n5. Model Context Protocol (MCP):\n- An open standardized protocol (developed by Anthropic) enabling secure, modular, bi-directional integration between AI models and external data sources / tools without custom brittle API code.",
    keyTalkingPoints: [
      "Agentic AI transforms LLMs from passive responders into autonomous goal-seeking engines",
      "ReAct loop: Thought -> Action (Tool Call) -> Observation -> Self-Correction",
      "Memory: Short-term (context window) + Long-term (vector embeddings / episodic DB)",
      "Model Context Protocol (MCP): Open standard for secure tool and data integration"
    ],
    category: "Machine Learning & AI",
    difficulty: "Hard",
    contextTag: "Agentic AI, ReAct Loop & MCP"
  },
  {
    id: 'ml-12',
    question: "Explain the differences between Prompt Engineering, RAG (Retrieval-Augmented Generation), Fine-Tuning (LoRA / PEFT), and RLHF (Reinforcement Learning from Human Feedback) in the GenAI adoption spectrum.",
    answer: "When building GenAI applications, teams choose from a spectrum of customization techniques based on cost, latency, and knowledge requirements:\n\n1. Prompt Engineering (Zero Cost / Instant):\n- Crafting system prompts, few-shot examples, and Chain-of-Thought reasoning within the existing model context window without modifying weights.\n\n2. RAG - Retrieval-Augmented Generation (Low-Medium Cost / Dynamic Knowledge):\n- Ingests private enterprise documents into Vector DBs (embeddings). At query time, retrieves relevant chunks and injects them into the prompt.\n- Best for: Dynamic data, factual accuracy, document citation, and eliminating knowledge cutoff dates without retraining.\n\n3. Fine-Tuning / LoRA - Parameter-Efficient Fine-Tuning (Medium Cost / Static Style & Syntax):\n- Adjusts model weights (or lightweight Low-Rank Adaptation matrices) on domain-specific datasets.\n- Best for: Teaching specialized output styles, proprietary syntax/code formats, or tone (not ideal for frequent factual updates).\n\n4. RLHF - Reinforcement Learning from Human Feedback (High Cost / Alignment):\n- Trains a Reward Model on human preferences and uses PPO/DPO algorithms to align model safety, helpfulness, and instruction following.",
    keyTalkingPoints: [
      "Prompt Engineering: In-context learning with zero weight updates",
      "RAG: Dynamic private knowledge retrieval with source citations (prevents hallucination)",
      "Fine-Tuning (LoRA): Modifies weight matrices for style, specialized vocabulary, and latency",
      "RLHF: Human preference alignment using reward models and DPO/PPO"
    ],
    category: "Machine Learning & AI",
    difficulty: "Medium",
    contextTag: "RAG vs Fine-Tuning vs Prompting vs RLHF"
  },
  {
    id: 'ml-13',
    question: "How do Vector Embeddings and Vector Search work? Compare similarity metrics: Cosine Similarity vs Dot Product vs Euclidean Distance (L2), and explain ANN indexing (HNSW).",
    answer: "1. Vector Embeddings:\n- Embedding models (e.g. OpenAI `text-embedding-3`, BERT) transform unstructured text/images into dense mathematical vectors in high-dimensional space (e.g. 1536 dimensions) where semantic similarity corresponds to spatial proximity.\n\n2. Similarity Metrics:\n- Cosine Similarity (`cos(theta) = (A . B) / (||A|| * ||B||)`): Measures the angle between two vectors regardless of magnitude. Range: -1 to 1. Ideal for text where document length varies.\n- Dot Product (`A . B`): Combines angle and vector magnitude. If vectors are normalized to unit length (`||A||=1`), Dot Product equals Cosine Similarity and executes much faster on GPUs.\n- Euclidean Distance (L2 `sqrt(sum((A_i - B_i)^2))`): Measures straight-line distance. Lower value indicates closer similarity.\n\n3. Approximate Nearest Neighbor (ANN) Indexing - HNSW:\n- Exhaustive exact kNN scan is O(N * D) (too slow for millions of vectors).\n- HNSW (Hierarchical Navigable Small World): Constructs a multi-layer graph with logarithmic skip-list navigation. Top layers have long-range sparse links for fast global jumps; bottom layers have dense local clustering, achieving sub-millisecond search at scale.",
    keyTalkingPoints: [
      "Embeddings convert semantic meaning into high-dimensional geometric vectors",
      "Cosine Similarity measures angular orientation; normalized Dot Product is computationally fastest",
      "HNSW uses hierarchical multi-layer skip-graphs to achieve ultra-fast sub-millisecond ANN search"
    ],
    category: "Machine Learning & AI",
    difficulty: "Hard",
    contextTag: "Vector Embeddings & HNSW Search"
  },
  {
    id: 'ml-14',
    question: "What is the difference between Artificial Intelligence (AI), Machine Learning (ML), and Deep Learning (DL)?",
    answer: "1. Artificial Intelligence (AI - Broadest Concept):\n- The overarching field of computer science dedicated to creating systems capable of performing tasks that typically require human intelligence (e.g. visual perception, decision-making, natural language translation).\n\n2. Machine Learning (ML - Subset of AI):\n- A subset of AI where algorithms learn patterns automatically from data rather than following rigid, explicit rule-based code (e.g. Linear Regression, Decision Trees, SVM).\n\n3. Deep Learning (DL - Subset of ML):\n- A specialized subset of ML based on Artificial Neural Networks with multiple deep layers (Deep Neural Networks) capable of automatically learning complex representations from massive datasets (e.g. CNNs for vision, Transformers for LLMs).",
    keyTalkingPoints: [
      "AI is the overarching umbrella field",
      "Machine Learning learns statistical patterns directly from data",
      "Deep Learning uses multi-layered neural networks for complex unstructured data"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "AI vs Machine Learning vs Deep Learning"
  },
  {
    id: 'ml-15',
    question: "What is Supervised Learning vs Unsupervised Learning? Give simple real-world examples of each.",
    answer: "1. Supervised Learning (Learning with a Teacher):\n- The algorithm is trained on labeled input-output pairs `(Features, Target Label)`.\n- Example: Spam Email Filter (Input: email text, Output: 'Spam' or 'Not Spam') or House Price Prediction (Input: size/location, Output: price).\n\n2. Unsupervised Learning (Learning without a Teacher):\n- The algorithm is given unlabeled input data and discovers hidden patterns, groupings, or clusters on its own.\n- Example: E-Commerce Customer Segmentation (Grouping shoppers based on purchasing habits without predefined labels).",
    keyTalkingPoints: [
      "Supervised learning trains on labeled data (Classification & Regression)",
      "Unsupervised learning discovers intrinsic clusters in unlabeled data (K-Means, PCA)",
      "Supervised has target ground truth; Unsupervised discovers hidden patterns"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "Supervised vs Unsupervised Learning"
  },
  {
    id: 'ml-16',
    question: "What is the difference between Classification and Regression in Supervised Learning?",
    answer: "1. Classification:\n- The target output variable `y` is categorical / discrete.\n- The model predicts a class label or probability of membership.\n- Examples: Binary Classification (Spam vs Not Spam, Pass vs Fail), Multi-class Classification (Cat vs Dog vs Bird).\n- Algorithms: Logistic Regression, Decision Trees, Random Forest, Naive Bayes.\n\n2. Regression:\n- The target output variable `y` is continuous / numerical value.\n- The model predicts a quantity or real number.\n- Examples: Predicting House Prices ($350,000), Stock Market Values, Temperature.\n- Algorithms: Linear Regression, Polynomial Regression, Ridge/Lasso.",
    keyTalkingPoints: [
      "Classification predicts discrete categories / class labels",
      "Regression predicts continuous numerical quantities",
      "Logistic Regression is for classification; Linear Regression is for regression"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "Classification vs Regression"
  },
  {
    id: 'ml-17',
    question: "What is Overfitting and Underfitting in Machine Learning, and how do you prevent each?",
    answer: "1. Overfitting (High Variance):\n- The model learns the training data too well, memorizing noise and outliers, failing to generalize to unseen test data.\n- Diagnosis: High training accuracy, low validation/test accuracy.\n- How to Fix: Add more training data, apply L1/L2 Regularization, use Dropout in neural networks, prune decision trees.\n\n2. Underfitting (High Bias):\n- The model is too simple to capture the underlying trend of the data.\n- Diagnosis: Low training accuracy, low validation accuracy.\n- How to Fix: Increase model complexity (use non-linear models), add more features, reduce regularization.",
    keyTalkingPoints: [
      "Overfitting: High training accuracy but fails on test data (memorizes noise)",
      "Underfitting: Poor performance on both training and test data (too simple)",
      "Fix overfitting with regularization and more data; fix underfitting with complex models"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "Overfitting vs Underfitting"
  },
  {
    id: 'ml-18',
    question: "What is a Confusion Matrix? Explain True Positives (TP), True Negatives (TN), False Positives (FP), and False Negatives (FN).",
    answer: "A Confusion Matrix is an evaluation table used to assess the performance of a classification model:\n\n1. True Positive (TP): The actual condition is Positive, and the model correctly predicted Positive (e.g. Sick patient correctly identified as sick).\n2. True Negative (TN): The actual condition is Negative, and the model correctly predicted Negative (e.g. Healthy patient correctly identified as healthy).\n3. False Positive (FP - Type I Error): The actual condition is Negative, but the model incorrectly predicted Positive (e.g. Healthy patient falsely flagged as sick).\n4. False Negative (FN - Type II Error): The actual condition is Positive, but the model incorrectly predicted Negative (e.g. Sick patient missed and labeled healthy).",
    keyTalkingPoints: [
      "Confusion matrix evaluates classification prediction accuracy vs actual ground truth",
      "TP (Correct positive), TN (Correct negative)",
      "FP is Type I error (False alarm); FN is Type II error (Missed detection)"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "Confusion Matrix: TP, TN, FP, FN"
  },
  {
    id: 'ml-19',
    question: "What is Feature Scaling (Normalization vs Standardization) and why is it important in Machine Learning?",
    answer: "Feature Scaling ensures that all numerical input features contribute equally to model calculations regardless of their original measurement scales (e.g. Age: 20-80 vs Salary: $30,000-$200,000).\n\n1. Normalization (Min-Max Scaling):\n- Rescales feature values to a fixed range between [0, 1]: `X_norm = (X - X_min) / (X_max - X_min)`.\n\n2. Standardization (Z-Score Normalization):\n- Centers feature around mean 0 with standard deviation 1: `X_stand = (X - mu) / sigma`.\n\nWhy It's Essential:\nDistance-based algorithms (KNN, K-Means, SVM) and gradient-based algorithms (Neural Networks, Logistic Regression) calculate Euclidean distances or gradients. Unscaled features with large numerical magnitudes dominate distance calculations and cause slow, erratic gradient descent.",
    keyTalkingPoints: [
      "Feature scaling prevents high-magnitude features from dominating calculations",
      "Min-Max Normalization rescales to [0, 1]; Standardization scales to mean 0 and std 1",
      "Crucial for distance algorithms (KNN, K-Means) and gradient descent optimization"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "Feature Scaling: Normalization vs Standardization"
  },
  {
    id: 'ml-20',
    question: "What is a Large Language Model (LLM) and what is a Prompt in Generative AI?",
    answer: "1. Large Language Model (LLM):\n- A deep learning transformer-based neural network trained on vast corpora of text data (billions of parameters) to understand, generate, summarize, and reason over natural human language.\n- Core mechanism: Autoregressive next-token prediction (predicting the most probable next word given prior context).\n- Examples: GPT-4, Gemini, Llama 3, Claude.\n\n2. Prompt:\n- The natural language input, instruction, or question provided to an LLM by a user to guide and condition the model's generated output response.",
    keyTalkingPoints: [
      "LLMs are deep Transformer neural networks trained on massive text datasets",
      "Core mechanism: Statistical next-token prediction based on context",
      "Prompt is the natural language instruction that conditions model output"
    ],
    category: "Machine Learning & AI",
    difficulty: "Easy",
    contextTag: "LLM Fundamentals & Prompts"
  }
];
