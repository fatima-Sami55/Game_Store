USE [master]
GO
/****** Object:  Database [Game_Store]    Script Date: 5/14/2025 12:14:58 AM ******/
CREATE DATABASE [Game_Store]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Game_Store', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS02\MSSQL\DATA\Game_Store.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Game_Store_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS02\MSSQL\DATA\Game_Store_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Game_Store] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Game_Store].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Game_Store] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Game_Store] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Game_Store] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Game_Store] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Game_Store] SET ARITHABORT OFF 
GO
ALTER DATABASE [Game_Store] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Game_Store] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Game_Store] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Game_Store] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Game_Store] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Game_Store] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Game_Store] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Game_Store] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Game_Store] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Game_Store] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Game_Store] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Game_Store] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Game_Store] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Game_Store] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Game_Store] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Game_Store] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Game_Store] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Game_Store] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Game_Store] SET  MULTI_USER 
GO
ALTER DATABASE [Game_Store] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Game_Store] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Game_Store] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Game_Store] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Game_Store] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Game_Store] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Game_Store] SET QUERY_STORE = ON
GO
ALTER DATABASE [Game_Store] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Game_Store]
GO
/****** Object:  Table [dbo].[billing]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[billing](
	[bill_id] [int] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[date] [date] NULL,
	[amount] [decimal](10, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[bill_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[card_details]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[card_details](
	[c_id] [int] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[c_number] [char](16) NULL,
	[cvc] [char](3) NULL,
	[expiry_date] [date] NULL,
	[c_name] [varchar](100) NULL,
	[type] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[c_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cart]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart](
	[user_id] [uniqueidentifier] NULL,
	[cart_id] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_cart] PRIMARY KEY CLUSTERED 
(
	[cart_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cart_products]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart_products](
	[cart_id] [int] NOT NULL,
	[pid] [int] NOT NULL,
	[quantity] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[cart_id] ASC,
	[pid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[inventory]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[inventory](
	[pid] [int] NOT NULL,
	[quantity] [int] NULL,
	[discount] [decimal](5, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[pid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orders]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orders](
	[o_id] [int] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[o_status] [varchar](50) NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[o_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[payment]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payment](
	[pid] [int] NOT NULL,
	[bill_id] [int] NULL,
	[p_method] [varchar](50) NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[pid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product](
	[pid] [int] NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[description] [nvarchar](max) NOT NULL,
	[price] [decimal](10, 2) NOT NULL,
	[genre] [nvarchar](100) NOT NULL,
	[status] [nvarchar](50) NOT NULL,
	[img] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[pid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[uuid] [uniqueidentifier] NOT NULL,
	[name] [varchar](100) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[password] [varchar](200) NOT NULL,
	[phone_number] [varchar](15) NOT NULL,
	[role] [varchar](20) NOT NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[uuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [unique_email] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[payment] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ('user') FOR [role]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[billing]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([uuid])
GO
ALTER TABLE [dbo].[card_details]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([uuid])
GO
ALTER TABLE [dbo].[cart]  WITH CHECK ADD  CONSTRAINT [FK__cart__user_id__59FA5E80] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([uuid])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[cart] CHECK CONSTRAINT [FK__cart__user_id__59FA5E80]
GO
ALTER TABLE [dbo].[cart_products]  WITH CHECK ADD FOREIGN KEY([pid])
REFERENCES [dbo].[product] ([pid])
GO
ALTER TABLE [dbo].[cart_products]  WITH CHECK ADD  CONSTRAINT [FK_cart_products_cart_id] FOREIGN KEY([cart_id])
REFERENCES [dbo].[cart] ([cart_id])
GO
ALTER TABLE [dbo].[cart_products] CHECK CONSTRAINT [FK_cart_products_cart_id]
GO
ALTER TABLE [dbo].[inventory]  WITH CHECK ADD FOREIGN KEY([pid])
REFERENCES [dbo].[product] ([pid])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([uuid])
GO
ALTER TABLE [dbo].[payment]  WITH CHECK ADD FOREIGN KEY([bill_id])
REFERENCES [dbo].[billing] ([bill_id])
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD  CONSTRAINT [chk_role] CHECK  (([role]='admin' OR [role]='user'))
GO
ALTER TABLE [dbo].[users] CHECK CONSTRAINT [chk_role]
GO
/****** Object:  Trigger [dbo].[trg_InsteadOfInsertProduct]    Script Date: 5/14/2025 12:14:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Step 1: Create the INSTEAD OF INSERT trigger
CREATE TRIGGER [dbo].[trg_InsteadOfInsertProduct]
ON [dbo].[product]
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @newPid INT;

    -- Get the highest current pid value from the table and increment it by 1
    SELECT @newPid = ISNULL(MAX(pid), 0) + 1 FROM Product;

    -- Insert the new row with the new pid
    INSERT INTO Product (pid, name, description, price, genre, status, img)
    SELECT @newPid, name, description, price, genre, status, img
    FROM inserted;
END;
GO
ALTER TABLE [dbo].[product] ENABLE TRIGGER [trg_InsteadOfInsertProduct]
GO
USE [master]
GO
ALTER DATABASE [Game_Store] SET  READ_WRITE 
GO
