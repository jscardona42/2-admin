--
-- PostgreSQL database dump
--

-- Dumped from database version 12.6
-- Dumped by pg_dump version 12.6

-- Started on 2021-04-16 10:57:41

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

--
-- TOC entry 1 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 2927 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 25897)
-- Name: Login; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Login" (
    id smallint NOT NULL,
    username text NOT NULL,
    password text,
    token text,
    salt text,
    role_id smallint NOT NULL,
    active_two_factor smallint DEFAULT 0,
    user_id smallint
);


ALTER TABLE public."Login" OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 25895)
-- Name: Login_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Login_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Login_id_seq" OWNER TO postgres;

--
-- TOC entry 2928 (class 0 OID 0)
-- Dependencies: 203
-- Name: Login_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Login_id_seq" OWNED BY public."Login".id;


--
-- TOC entry 206 (class 1259 OID 25909)
-- Name: Menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Menus" (
    id integer NOT NULL,
    title text NOT NULL,
    path text NOT NULL,
    "isEntity" boolean NOT NULL,
    "parentMenuId" integer
);


ALTER TABLE public."Menus" OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 25907)
-- Name: Menus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Menus_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Menus_id_seq" OWNER TO postgres;

--
-- TOC entry 2929 (class 0 OID 0)
-- Dependencies: 205
-- Name: Menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Menus_id_seq" OWNED BY public."Menus".id;


--
-- TOC entry 208 (class 1259 OID 25920)
-- Name: Microservices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Microservices" (
    id smallint NOT NULL,
    name character varying(255),
    hostname character varying(255),
    port integer,
    url character varying(32),
    state integer
);


ALTER TABLE public."Microservices" OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 25918)
-- Name: Microservices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Microservices_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Microservices_id_seq" OWNER TO postgres;

--
-- TOC entry 2930 (class 0 OID 0)
-- Dependencies: 207
-- Name: Microservices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Microservices_id_seq" OWNED BY public."Microservices".id;


--
-- TOC entry 210 (class 1259 OID 25931)
-- Name: Permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permissions" (
    id smallint NOT NULL,
    name character varying(50),
    permissions character varying(255)
);


ALTER TABLE public."Permissions" OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 25929)
-- Name: Permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Permissions_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Permissions_id_seq" OWNER TO postgres;

--
-- TOC entry 2931 (class 0 OID 0)
-- Dependencies: 209
-- Name: Permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Permissions_id_seq" OWNED BY public."Permissions".id;


--
-- TOC entry 212 (class 1259 OID 25939)
-- Name: Roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roles" (
    id smallint NOT NULL,
    role character varying(100) NOT NULL
);


ALTER TABLE public."Roles" OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 25937)
-- Name: Roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Roles_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Roles_id_seq" OWNER TO postgres;

--
-- TOC entry 2932 (class 0 OID 0)
-- Dependencies: 211
-- Name: Roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Roles_id_seq" OWNED BY public."Roles".id;


--
-- TOC entry 214 (class 1259 OID 25947)
-- Name: Roles_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roles_permissions" (
    id smallint NOT NULL,
    role_id smallint NOT NULL,
    permissions_menu text[],
    permissions text
);


ALTER TABLE public."Roles_permissions" OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 25945)
-- Name: Roles_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Roles_permissions_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Roles_permissions_id_seq" OWNER TO postgres;

--
-- TOC entry 2933 (class 0 OID 0)
-- Dependencies: 213
-- Name: Roles_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Roles_permissions_id_seq" OWNED BY public."Roles_permissions".id;


--
-- TOC entry 216 (class 1259 OID 25958)
-- Name: Twofactor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Twofactor" (
    twofactor_id smallint NOT NULL,
    twofactor_secret character varying(255),
    config_twofactor smallint DEFAULT 0,
    login_id smallint NOT NULL,
    recovery_code character varying(255),
    validation_method_id smallint,
    time_creation_code timestamp(6) without time zone
);


ALTER TABLE public."Twofactor" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 25956)
-- Name: Twofactor_twofactor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Twofactor_twofactor_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Twofactor_twofactor_id_seq" OWNER TO postgres;

--
-- TOC entry 2934 (class 0 OID 0)
-- Dependencies: 215
-- Name: Twofactor_twofactor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Twofactor_twofactor_id_seq" OWNED BY public."Twofactor".twofactor_id;


--
-- TOC entry 218 (class 1259 OID 25970)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id smallint NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    state smallint DEFAULT 1
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 25968)
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO postgres;

--
-- TOC entry 2935 (class 0 OID 0)
-- Dependencies: 217
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 220 (class 1259 OID 26007)
-- Name: Validation_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Validation_methods" (
    validation_method_id smallint NOT NULL,
    validation_method character varying(255) NOT NULL,
    state smallint DEFAULT 1
);


ALTER TABLE public."Validation_methods" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 26005)
-- Name: Validation_methods_validation_method_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Validation_methods_validation_method_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Validation_methods_validation_method_id_seq" OWNER TO postgres;

--
-- TOC entry 2936 (class 0 OID 0)
-- Dependencies: 219
-- Name: Validation_methods_validation_method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Validation_methods_validation_method_id_seq" OWNED BY public."Validation_methods".validation_method_id;


--
-- TOC entry 2741 (class 2604 OID 25900)
-- Name: Login id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Login" ALTER COLUMN id SET DEFAULT nextval('public."Login_id_seq"'::regclass);


--
-- TOC entry 2743 (class 2604 OID 25912)
-- Name: Menus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Menus" ALTER COLUMN id SET DEFAULT nextval('public."Menus_id_seq"'::regclass);


--
-- TOC entry 2744 (class 2604 OID 25923)
-- Name: Microservices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Microservices" ALTER COLUMN id SET DEFAULT nextval('public."Microservices_id_seq"'::regclass);


--
-- TOC entry 2745 (class 2604 OID 25934)
-- Name: Permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permissions" ALTER COLUMN id SET DEFAULT nextval('public."Permissions_id_seq"'::regclass);


--
-- TOC entry 2746 (class 2604 OID 25942)
-- Name: Roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles" ALTER COLUMN id SET DEFAULT nextval('public."Roles_id_seq"'::regclass);


--
-- TOC entry 2747 (class 2604 OID 25950)
-- Name: Roles_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles_permissions" ALTER COLUMN id SET DEFAULT nextval('public."Roles_permissions_id_seq"'::regclass);


--
-- TOC entry 2748 (class 2604 OID 25961)
-- Name: Twofactor twofactor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Twofactor" ALTER COLUMN twofactor_id SET DEFAULT nextval('public."Twofactor_twofactor_id_seq"'::regclass);


--
-- TOC entry 2750 (class 2604 OID 25973)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- TOC entry 2752 (class 2604 OID 26010)
-- Name: Validation_methods validation_method_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Validation_methods" ALTER COLUMN validation_method_id SET DEFAULT nextval('public."Validation_methods_validation_method_id_seq"'::regclass);


--
-- TOC entry 2905 (class 0 OID 25897)
-- Dependencies: 204
-- Data for Name: Login; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Login" (id, username, password, token, salt, role_id, active_two_factor, user_id) FROM stdin;
1	usuario1	$2b$10$6TF0Rmnmmq9Ch60QcmbfIunkYibcuFGGG7NjdnwDRpw59sV1UC58m	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTYxODQxMzEzMiwiZXhwIjoxNjE4NDE2NzMyfQ.kSEI8lUwK4DA7SnruBWkHpAbZo-IeQBtcbAu9a4GEOc	$2b$10$6TF0Rmnmmq9Ch60QcmbfIu	1	1	1
3	usuario3	$2b$10$seOm91q6A/T1Vp81lgwzl.MZdm1MrVtt5clB3XHNkZtyiMyr01BUe	\N	$2b$10$seOm91q6A/T1Vp81lgwzl.	2	0	3
2	usuario2	$2b$10$tto94NATru7NdjZ0lIMv5.ko1Zmms5puWonOoISgvJ62oXoGacbNy	\N	$2b$10$tto94NATru7NdjZ0lIMv5.	2	1	2
\.


--
-- TOC entry 2907 (class 0 OID 25909)
-- Dependencies: 206
-- Data for Name: Menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Menus" (id, title, path, "isEntity", "parentMenuId") FROM stdin;
1	menu	/	f	\N
2	administracion	/administracion	f	1
3	configuracion	/administracion/configuracion	f	2
4	general	/general	f	1
5	reportes	/general/reportes	f	4
6	formularios	/administracion/configuracion/formularios	t	3
7	comment	/administracion/configuracion/comment	t	3
10	user	/general/reportes/user	t	5
11	sales	/sales	f	1
12	invoices	/sales/invoices	t	11
8	workflow	/administracion/workflow	f	2
9	inventory	/administracion/workflow/inventory	t	8
\.


--
-- TOC entry 2909 (class 0 OID 25920)
-- Dependencies: 208
-- Data for Name: Microservices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Microservices" (id, name, hostname, port, url, state) FROM stdin;
1	admin	localhost	3003	http://localhost:3003/graphql	1
\.


--
-- TOC entry 2911 (class 0 OID 25931)
-- Dependencies: 210
-- Data for Name: Permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permissions" (id, name, permissions) FROM stdin;
3	LoginResolver	["getLogin","getLoginById","signInLogin","signUpLogin"]
4	TwofactorResolver	["createTwoFactor","getTwoFactorById","configTwoFactor","validateTwoFactorCode","setActivateConfigTwofactorTOTP","validateRecoveryCode","sendMail","validationCodeMail"]
1	AdminResolver	["getPermissions","getRoles","getRolesPermissions"]
2	MenuResolver	["rootMenu","createRootMenu","createFolder","insertEntityToFolder","filteredMenuForRoleId"]
\.


--
-- TOC entry 2913 (class 0 OID 25939)
-- Dependencies: 212
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roles" (id, role) FROM stdin;
2	Commercial
3	Inventory
1	Administrator
\.


--
-- TOC entry 2915 (class 0 OID 25947)
-- Dependencies: 214
-- Data for Name: Roles_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roles_permissions" (id, role_id, permissions_menu, permissions) FROM stdin;
1	1	{user,comment,inventory,formularios,invoices}	["findAllProducts","findAllOrders"]
2	2	{comment,inventory}	["findAllProducts","findAllOrders"]
\.


--
-- TOC entry 2917 (class 0 OID 25958)
-- Dependencies: 216
-- Data for Name: Twofactor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Twofactor" (twofactor_id, twofactor_secret, config_twofactor, login_id, recovery_code, validation_method_id, time_creation_code) FROM stdin;
1	K44RK2RXBJFRMBBR	1	1	$2b$10$6TF0Rmnmmq9Ch60QcmbfIuSWhcXzu71WC2ROnv4HF4HxcOyi4THTy	1	2021-04-16 15:35:19.783
2	\N	0	2	$2b$10$tto94NATru7NdjZ0lIMv5.XilW9p8pZcTWFPRxYW7jOVPehOHuDwW	2	2021-04-16 15:36:19.209
\.


--
-- TOC entry 2919 (class 0 OID 25970)
-- Dependencies: 218
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, email, state) FROM stdin;
3	Yaky Sánchez	yaky0723@gmail.com	1
2	Juan Gonzalez	jscardona42@gmail.com	1
1	Johán Cardona	jscardona42@gmail.com	1
\.


--
-- TOC entry 2921 (class 0 OID 26007)
-- Dependencies: 220
-- Data for Name: Validation_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Validation_methods" (validation_method_id, validation_method, state) FROM stdin;
2	Email	1
3	SMS	1
1	TOTP	1
\.


--
-- TOC entry 2937 (class 0 OID 0)
-- Dependencies: 203
-- Name: Login_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Login_id_seq"', 6, true);


--
-- TOC entry 2938 (class 0 OID 0)
-- Dependencies: 205
-- Name: Menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Menus_id_seq"', 13, true);


--
-- TOC entry 2939 (class 0 OID 0)
-- Dependencies: 207
-- Name: Microservices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Microservices_id_seq"', 1, true);


--
-- TOC entry 2940 (class 0 OID 0)
-- Dependencies: 209
-- Name: Permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Permissions_id_seq"', 4, true);


--
-- TOC entry 2941 (class 0 OID 0)
-- Dependencies: 211
-- Name: Roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Roles_id_seq"', 3, true);


--
-- TOC entry 2942 (class 0 OID 0)
-- Dependencies: 213
-- Name: Roles_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Roles_permissions_id_seq"', 2, true);


--
-- TOC entry 2943 (class 0 OID 0)
-- Dependencies: 215
-- Name: Twofactor_twofactor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Twofactor_twofactor_id_seq"', 6, true);


--
-- TOC entry 2944 (class 0 OID 0)
-- Dependencies: 217
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 2, true);


--
-- TOC entry 2945 (class 0 OID 0)
-- Dependencies: 219
-- Name: Validation_methods_validation_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Validation_methods_validation_method_id_seq"', 3, true);


--
-- TOC entry 2755 (class 2606 OID 25906)
-- Name: Login Login_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Login"
    ADD CONSTRAINT "Login_pkey" PRIMARY KEY (id);


--
-- TOC entry 2757 (class 2606 OID 25917)
-- Name: Menus Menus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Menus"
    ADD CONSTRAINT "Menus_pkey" PRIMARY KEY (id);


--
-- TOC entry 2759 (class 2606 OID 25928)
-- Name: Microservices Microservices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Microservices"
    ADD CONSTRAINT "Microservices_pkey" PRIMARY KEY (id);


--
-- TOC entry 2761 (class 2606 OID 25936)
-- Name: Permissions Permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permissions"
    ADD CONSTRAINT "Permissions_pkey" PRIMARY KEY (id);


--
-- TOC entry 2765 (class 2606 OID 25955)
-- Name: Roles_permissions Roles_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles_permissions"
    ADD CONSTRAINT "Roles_permissions_pkey" PRIMARY KEY (id);


--
-- TOC entry 2763 (class 2606 OID 25944)
-- Name: Roles Roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY (id);


--
-- TOC entry 2767 (class 2606 OID 25967)
-- Name: Twofactor Twofactor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Twofactor"
    ADD CONSTRAINT "Twofactor_pkey" PRIMARY KEY (twofactor_id);


--
-- TOC entry 2769 (class 2606 OID 25976)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 2771 (class 2606 OID 26013)
-- Name: Validation_methods Validation_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Validation_methods"
    ADD CONSTRAINT "Validation_methods_pkey" PRIMARY KEY (validation_method_id);


--
-- TOC entry 2772 (class 2606 OID 25977)
-- Name: Login Login_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Login"
    ADD CONSTRAINT "Login_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public."Roles"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2773 (class 2606 OID 25982)
-- Name: Login Login_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Login"
    ADD CONSTRAINT "Login_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2774 (class 2606 OID 25987)
-- Name: Menus Menus_parentMenuId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Menus"
    ADD CONSTRAINT "Menus_parentMenuId_fkey" FOREIGN KEY ("parentMenuId") REFERENCES public."Menus"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2775 (class 2606 OID 25992)
-- Name: Roles_permissions Roles_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles_permissions"
    ADD CONSTRAINT "Roles_permissions_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public."Roles"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2776 (class 2606 OID 25997)
-- Name: Twofactor Twofactor_login_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Twofactor"
    ADD CONSTRAINT "Twofactor_login_id_fkey" FOREIGN KEY (login_id) REFERENCES public."Login"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2777 (class 2606 OID 26020)
-- Name: Twofactor fk_validation_method_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Twofactor"
    ADD CONSTRAINT fk_validation_method_id FOREIGN KEY (validation_method_id) REFERENCES public."Validation_methods"(validation_method_id);


-- Completed on 2021-04-16 10:57:41

--
-- PostgreSQL database dump complete
--

