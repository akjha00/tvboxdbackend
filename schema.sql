--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_feed; Type: TABLE; Schema: public; Owner: abhayakrishnanjha
--

CREATE TABLE public.activity_feed (
    id integer NOT NULL,
    user_id integer,
    activity_type text,
    show_id integer,
    episode_id integer,
    content text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.activity_feed OWNER TO abhayakrishnanjha;

--
-- Name: activity_feed_id_seq; Type: SEQUENCE; Schema: public; Owner: abhayakrishnanjha
--

CREATE SEQUENCE public.activity_feed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activity_feed_id_seq OWNER TO abhayakrishnanjha;

--
-- Name: activity_feed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abhayakrishnanjha
--

ALTER SEQUENCE public.activity_feed_id_seq OWNED BY public.activity_feed.id;


--
-- Name: episodes; Type: TABLE; Schema: public; Owner: abhayakrishnanjha
--

CREATE TABLE public.episodes (
    id integer NOT NULL,
    show_id integer,
    season_number integer,
    episode_number integer,
    title text,
    synopsis text,
    air_date date
);


ALTER TABLE public.episodes OWNER TO abhayakrishnanjha;

--
-- Name: episodes_id_seq; Type: SEQUENCE; Schema: public; Owner: abhayakrishnanjha
--

CREATE SEQUENCE public.episodes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.episodes_id_seq OWNER TO abhayakrishnanjha;

--
-- Name: episodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abhayakrishnanjha
--

ALTER SEQUENCE public.episodes_id_seq OWNED BY public.episodes.id;


--
-- Name: follows; Type: TABLE; Schema: public; Owner: abhayakrishnanjha
--

CREATE TABLE public.follows (
    id integer NOT NULL,
    follower_id integer,
    following_id integer,
    CONSTRAINT follows_check CHECK ((follower_id <> following_id))
);


ALTER TABLE public.follows OWNER TO abhayakrishnanjha;

--
-- Name: follows_id_seq; Type: SEQUENCE; Schema: public; Owner: abhayakrishnanjha
--

CREATE SEQUENCE public.follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.follows_id_seq OWNER TO abhayakrishnanjha;

--
-- Name: follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abhayakrishnanjha
--

ALTER SEQUENCE public.follows_id_seq OWNED BY public.follows.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: abhayakrishnanjha
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    user_id integer,
    username text NOT NULL,
    bio text,
    avatar_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.profiles OWNER TO abhayakrishnanjha;

--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: abhayakrishnanjha
--

CREATE SEQUENCE public.profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.profiles_id_seq OWNER TO abhayakrishnanjha;

--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abhayakrishnanjha
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: abhayakrishnanjha
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    user_id integer,
    show_id integer,
    rating integer,
    review text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT ratings_rating_check CHECK (((rating IS NULL) OR ((rating >= 0) AND (rating <= 10))))
);


ALTER TABLE public.ratings OWNER TO abhayakrishnanjha;

--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: abhayakrishnanjha
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ratings_id_seq OWNER TO abhayakrishnanjha;

--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abhayakrishnanjha
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: tv_shows; Type: TABLE; Schema: public; Owner: abhayakrishnanjha
--

CREATE TABLE public.tv_shows (
    id integer NOT NULL,
    tmdb_id integer,
    title text NOT NULL,
    release_year integer,
    genre text,
    description text,
    poster_url text
);


ALTER TABLE public.tv_shows OWNER TO abhayakrishnanjha;

--
-- Name: tv_shows_id_seq; Type: SEQUENCE; Schema: public; Owner: abhayakrishnanjha
--

CREATE SEQUENCE public.tv_shows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tv_shows_id_seq OWNER TO abhayakrishnanjha;

--
-- Name: tv_shows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abhayakrishnanjha
--

ALTER SEQUENCE public.tv_shows_id_seq OWNED BY public.tv_shows.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: abhayakrishnanjha
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO abhayakrishnanjha;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: abhayakrishnanjha
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO abhayakrishnanjha;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abhayakrishnanjha
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: watchlist; Type: TABLE; Schema: public; Owner: abhayakrishnanjha
--

CREATE TABLE public.watchlist (
    id integer NOT NULL,
    user_id integer,
    show_id integer,
    status text,
    current_season integer DEFAULT 1,
    current_episode integer DEFAULT 1,
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT watchlist_status_check CHECK ((status = ANY (ARRAY['watching'::text, 'completed'::text, 'planned'::text, 'paused'::text])))
);


ALTER TABLE public.watchlist OWNER TO abhayakrishnanjha;

--
-- Name: watchlist_id_seq; Type: SEQUENCE; Schema: public; Owner: abhayakrishnanjha
--

CREATE SEQUENCE public.watchlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.watchlist_id_seq OWNER TO abhayakrishnanjha;

--
-- Name: watchlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abhayakrishnanjha
--

ALTER SEQUENCE public.watchlist_id_seq OWNED BY public.watchlist.id;


--
-- Name: activity_feed id; Type: DEFAULT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.activity_feed ALTER COLUMN id SET DEFAULT nextval('public.activity_feed_id_seq'::regclass);


--
-- Name: episodes id; Type: DEFAULT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.episodes ALTER COLUMN id SET DEFAULT nextval('public.episodes_id_seq'::regclass);


--
-- Name: follows id; Type: DEFAULT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.follows ALTER COLUMN id SET DEFAULT nextval('public.follows_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: tv_shows id; Type: DEFAULT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.tv_shows ALTER COLUMN id SET DEFAULT nextval('public.tv_shows_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: watchlist id; Type: DEFAULT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.watchlist ALTER COLUMN id SET DEFAULT nextval('public.watchlist_id_seq'::regclass);


--
-- Name: activity_feed activity_feed_pkey; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.activity_feed
    ADD CONSTRAINT activity_feed_pkey PRIMARY KEY (id);


--
-- Name: episodes episodes_pkey; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_pkey PRIMARY KEY (id);


--
-- Name: follows follows_follower_id_following_id_key; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_following_id_key UNIQUE (follower_id, following_id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_user_show_unique; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_show_unique UNIQUE (user_id, show_id);


--
-- Name: tv_shows tv_shows_pkey; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.tv_shows
    ADD CONSTRAINT tv_shows_pkey PRIMARY KEY (id);


--
-- Name: tv_shows tv_shows_tmdb_id_key; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.tv_shows
    ADD CONSTRAINT tv_shows_tmdb_id_key UNIQUE (tmdb_id);


--
-- Name: watchlist unique_user_show; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT unique_user_show UNIQUE (user_id, show_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: watchlist watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_pkey PRIMARY KEY (id);


--
-- Name: activity_feed activity_feed_episode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.activity_feed
    ADD CONSTRAINT activity_feed_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES public.episodes(id);


--
-- Name: activity_feed activity_feed_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.activity_feed
    ADD CONSTRAINT activity_feed_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.tv_shows(id);


--
-- Name: activity_feed activity_feed_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.activity_feed
    ADD CONSTRAINT activity_feed_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: episodes episodes_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.tv_shows(id);


--
-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: follows follows_following_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.tv_shows(id);


--
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: watchlist watchlist_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.tv_shows(id);


--
-- Name: watchlist watchlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhayakrishnanjha
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

