create table authUser
(
    id          int auto_increment
        primary key,
    dateTry     datetime(3) default current_timestamp(3) not null,
    uuidUser    varchar(191)                             not null,
    ipTry       varchar(191)                             null,
    statsDevice varchar(191)                             not null
)
    collate = utf8mb4_unicode_ci;

create table coin
(
    id    int auto_increment
        primary key,
    name  varchar(191) not null,
    value varchar(191) not null
)
    collate = utf8mb4_unicode_ci;

create table historyCoin
(
    id    int auto_increment
        primary key,
    name  varchar(191) not null,
    value varchar(191) not null
)
    collate = utf8mb4_unicode_ci;

create table logs
(
    id         int auto_increment
        primary key,
    actionUser longtext                                 not null,
    date       datetime(3) default current_timestamp(3) not null
)
    collate = utf8mb4_unicode_ci;

create table signUpUser
(
    id          int auto_increment
        primary key,
    dateTry     datetime(3) default current_timestamp(3) not null,
    ipTry       varchar(191)                             null,
    statsDevice varchar(191)                             not null
)
    collate = utf8mb4_unicode_ci;

create table users
(
    uuid            varchar(191)                             not null
        primary key,
    firstName       varchar(191)                             not null,
    lastName        varchar(191)                             not null,
    email           varchar(191)                             not null,
    password        varchar(191)                             not null,
    wordSafe        varchar(191)                             not null,
    lastLogin       datetime(3) default current_timestamp(3) not null,
    lastIP          varchar(191)                             null,
    lastStatsDevice longtext                                 not null,
    firstLogin      datetime(3) default current_timestamp(3) not null,
    coins           longtext collate utf8mb4_bin             not null
        check (json_valid(`coins`)),
    balance         int                                      not null,
    typeUser        int                                      not null,
    is_verified     tinyint(1)  default 0                    not null,
    token           longtext    default ''                   not null
)
    collate = utf8mb4_unicode_ci;

