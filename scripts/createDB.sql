USE [master]
GO

Alter Database TagList
  SET SINGLE_USER With ROLLBACK IMMEDIATE

/****** Object:  Database [TagList]    Script Date: 01/05/2012 14:14:38 ******/
IF  EXISTS (SELECT name FROM sys.databases WHERE name = N'TagList')
DROP DATABASE [TagList]
GO


USE [master]
GO

/****** Object:  Database [TagList]    Script Date: 01/05/2012 14:14:23 ******/
CREATE DATABASE [TagList] ON  PRIMARY 
( NAME = N'TagList', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10.MSSQLSERVER\MSSQL\DATA\TagList.mdf' , SIZE = 2048KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'TagList_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10.MSSQLSERVER\MSSQL\DATA\TagList_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO

ALTER DATABASE [TagList] SET COMPATIBILITY_LEVEL = 100
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [TagList].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [TagList] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [TagList] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [TagList] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [TagList] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [TagList] SET ARITHABORT OFF 
GO

ALTER DATABASE [TagList] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [TagList] SET AUTO_CREATE_STATISTICS ON 
GO

ALTER DATABASE [TagList] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [TagList] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [TagList] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [TagList] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [TagList] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [TagList] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [TagList] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [TagList] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [TagList] SET  DISABLE_BROKER 
GO

ALTER DATABASE [TagList] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [TagList] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [TagList] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [TagList] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [TagList] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [TagList] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [TagList] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [TagList] SET  READ_WRITE 
GO

ALTER DATABASE [TagList] SET RECOVERY FULL 
GO

ALTER DATABASE [TagList] SET  MULTI_USER 
GO

ALTER DATABASE [TagList] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [TagList] SET DB_CHAINING OFF 
GO

USE TagList
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY NOT NULL,
	[UserName] [varchar](50) NOT NULL,
	[Email] [varchar](100) NULL,
	[Password] [varchar](50) NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
CREATE TABLE [dbo].[List](
	[ListID] [int] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](50) NULL,
	[CreatedByUserId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_List] PRIMARY KEY CLUSTERED 
(
	[ListID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]


ALTER TABLE [dbo].[List] ADD  CONSTRAINT [DF_List_Created]  DEFAULT (getdate()) FOR [CreateDate]
GO


CREATE TABLE [dbo].[SharedList](
	[SharedListID] [int] IDENTITY NOT NULL,
	[ListID] [int] NOT NULL,
	[UserID] [int] NOT NULL,
	[Permissions] [int] NOT NULL,
 CONSTRAINT [PK_SharedList] PRIMARY KEY CLUSTERED 
(
	[SharedListID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[SharedList]  WITH CHECK ADD  CONSTRAINT [FK_SharedList_SharedList] FOREIGN KEY([SharedListID])
REFERENCES [dbo].[SharedList] ([SharedListID])
GO

ALTER TABLE [dbo].[SharedList] CHECK CONSTRAINT [FK_SharedList_SharedList]
GO

ALTER TABLE [dbo].[SharedList] ADD  CONSTRAINT [DF_SharedList_Permissions]  DEFAULT ((0)) FOR [Permissions]
GO

CREATE TABLE [dbo].[ListItem](
	[ListItemID] [int] IDENTITY(1,1) NOT NULL,
	[ListID] [int] NOT NULL,
	[Title] [varchar](50) NOT NULL,
	[Description] [varchar](50) NULL,
	[Complete] [bit] NOT NULL,
	[Sort] [int] NULL,
	[CreatedByUserId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_ListItem] PRIMARY KEY CLUSTERED 
(
	[ListItemID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


ALTER TABLE [dbo].[ListItem] ADD  CONSTRAINT [DF_ListItem_Complete]  DEFAULT ((0)) FOR [Complete]
GO

ALTER TABLE [dbo].[ListItem] ADD  CONSTRAINT [DF_ListItem_Created]  DEFAULT (getdate()) FOR [CreateDate]
GO

 CREATE USER [Intellagent_Demo] FOR LOGIN [Intellagent_Demo]
 EXEC sp_addrolemember N'db_owner',N'Intellagent_Demo'
 
insert into Users(UserName,Email)
values
('jamie','jamie@intellagent.com')
GO

insert into List(Title,CreatedByUserId)
VALUES
('My First List',1)
GO

insert into ListItem(Title, ListID)
VALUES
('My first item',1)
GO

insert into ListItem(Title, ListID)
VALUES
('My second item',1)
GO