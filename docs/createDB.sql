create table users(
  user_id integer primary key,
  uname text,
  fname text,
  lname text,
  email text,
  privilege text,
  password text
);

create table kids(
  kid_id integer primary key,
  fname text,
  lname text,
  gender text,
  bday text,
  school text,
  email text,
  phone text,
  pname text,
  address text
);

create table events(
  event_id integer primary key,
  name text,
  date text,
  time text
);

create table attendance(
  attendee_id integer primary key,
  event integer,
  kid integer,
  foreign key(event) references events(event_id),
  foreign key(kid) references kids(kid_id)
);

insert into users (uname,fname,lname,email,privilege,password) values ("criggs","Caleb","Riggs","criggs626@gmail.com","admin","b071246449a9f420ea2e18f253655fd4071d51f94830f29088958d84a06fedcf");
