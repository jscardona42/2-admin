--
-- PostgreSQL database dump
--

-- Dumped from database version 12.6
-- Dumped by pg_dump version 12.6

-- Started on 2021-06-09 17:00:49

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
-- TOC entry 1 (class 3079 OID 18923)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 3105 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


--
-- TOC entry 3 (class 3079 OID 18932)
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- TOC entry 3106 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 19057)
-- Name: Auditorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Auditorias" (
    auditoria_id smallint NOT NULL,
    login_id smallint,
    status character varying(50),
    fecha_creacion timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo character varying(50),
    username character varying(100),
    rol character varying(50),
    tiene_doble_factor boolean
);


ALTER TABLE public."Auditorias" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 19138)
-- Name: Auditorias_auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Auditorias_auditoria_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Auditorias_auditoria_id_seq" OWNER TO postgres;

--
-- TOC entry 3107 (class 0 OID 0)
-- Dependencies: 225
-- Name: Auditorias_auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Auditorias_auditoria_id_seq" OWNED BY public."Auditorias".auditoria_id;


--
-- TOC entry 219 (class 1259 OID 19117)
-- Name: DoblesFactores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DoblesFactores" (
    doble_factor_id smallint NOT NULL,
    otplib_secreta character varying(255),
    esta_configurado boolean DEFAULT false NOT NULL,
    login_id smallint NOT NULL,
    codigo_recuperacion character varying(255),
    metodo_validacion_id smallint,
    fecha_creacion_codigo timestamp(6) without time zone
);


ALTER TABLE public."DoblesFactores" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 19124)
-- Name: DoblesFactores_doble_factor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DoblesFactores_doble_factor_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DoblesFactores_doble_factor_id_seq" OWNER TO postgres;

--
-- TOC entry 3108 (class 0 OID 0)
-- Dependencies: 220
-- Name: DoblesFactores_doble_factor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DoblesFactores_doble_factor_id_seq" OWNED BY public."DoblesFactores".doble_factor_id;


--
-- TOC entry 227 (class 1259 OID 21414)
-- Name: Empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Empresas" (
    empresa_id smallint NOT NULL,
    nombre character varying(255)
);


ALTER TABLE public."Empresas" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 21430)
-- Name: EmpresasMenus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmpresasMenus" (
    empresa_menu_id smallint NOT NULL,
    empresa_id smallint NOT NULL,
    menu_id smallint NOT NULL
);


ALTER TABLE public."EmpresasMenus" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 21491)
-- Name: MenuPersonalizado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MenuPersonalizado" (
    menu_pesonalizado_id smallint NOT NULL,
    empresa_id smallint NOT NULL,
    menu json NOT NULL
);


ALTER TABLE public."MenuPersonalizado" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 21489)
-- Name: EmpresasMenusPersonalizado_empresa_menu_pesonalizado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EmpresasMenusPersonalizado_empresa_menu_pesonalizado_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EmpresasMenusPersonalizado_empresa_menu_pesonalizado_id_seq" OWNER TO postgres;

--
-- TOC entry 3109 (class 0 OID 0)
-- Dependencies: 230
-- Name: EmpresasMenusPersonalizado_empresa_menu_pesonalizado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EmpresasMenusPersonalizado_empresa_menu_pesonalizado_id_seq" OWNED BY public."MenuPersonalizado".menu_pesonalizado_id;


--
-- TOC entry 228 (class 1259 OID 21428)
-- Name: EmpresasMenus_empresa_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EmpresasMenus_empresa_menu_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EmpresasMenus_empresa_menu_id_seq" OWNER TO postgres;

--
-- TOC entry 3110 (class 0 OID 0)
-- Dependencies: 228
-- Name: EmpresasMenus_empresa_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EmpresasMenus_empresa_menu_id_seq" OWNED BY public."EmpresasMenus".empresa_menu_id;


--
-- TOC entry 226 (class 1259 OID 21412)
-- Name: Empresas_empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Empresas_empresa_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Empresas_empresa_id_seq" OWNER TO postgres;

--
-- TOC entry 3111 (class 0 OID 0)
-- Dependencies: 226
-- Name: Empresas_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Empresas_empresa_id_seq" OWNED BY public."Empresas".empresa_id;


--
-- TOC entry 213 (class 1259 OID 19094)
-- Name: Entidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Entidades" (
    entidad_id smallint NOT NULL,
    nombre character varying(255) NOT NULL,
    resolver character varying(255)
);


ALTER TABLE public."Entidades" OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 19097)
-- Name: Entidades_entidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Entidades_entidad_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Entidades_entidad_id_seq" OWNER TO postgres;

--
-- TOC entry 3112 (class 0 OID 0)
-- Dependencies: 214
-- Name: Entidades_entidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Entidades_entidad_id_seq" OWNED BY public."Entidades".entidad_id;


--
-- TOC entry 205 (class 1259 OID 19061)
-- Name: Login; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Login" (
    login_id smallint NOT NULL,
    username text NOT NULL,
    password text,
    token text,
    salt text,
    rol_id smallint NOT NULL,
    tiene_doble_factor smallint DEFAULT 0,
    usuario_id smallint
);


ALTER TABLE public."Login" OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 19068)
-- Name: Login_login_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Login_login_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Login_login_id_seq" OWNER TO postgres;

--
-- TOC entry 3113 (class 0 OID 0)
-- Dependencies: 206
-- Name: Login_login_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Login_login_id_seq" OWNED BY public."Login".login_id;


--
-- TOC entry 207 (class 1259 OID 19070)
-- Name: Menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Menus" (
    menu_id smallint NOT NULL,
    title text NOT NULL,
    path text NOT NULL,
    "isEntity" boolean NOT NULL,
    "parentMenuId" smallint,
    entidad_id smallint,
    "order" smallint,
    level smallint
);


ALTER TABLE public."Menus" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 21526)
-- Name: MenusPalabras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MenusPalabras" (
    menu_palabra_id smallint NOT NULL,
    menu_id smallint NOT NULL,
    palabra character varying(16) NOT NULL
);


ALTER TABLE public."MenusPalabras" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 21522)
-- Name: MenusPalabras_menu_palabra_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MenusPalabras_menu_palabra_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."MenusPalabras_menu_palabra_id_seq" OWNER TO postgres;

--
-- TOC entry 3114 (class 0 OID 0)
-- Dependencies: 232
-- Name: MenusPalabras_menu_palabra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MenusPalabras_menu_palabra_id_seq" OWNED BY public."MenusPalabras".menu_palabra_id;


--
-- TOC entry 233 (class 1259 OID 21524)
-- Name: MenusPalabras_palabra_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MenusPalabras_palabra_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."MenusPalabras_palabra_seq" OWNER TO postgres;

--
-- TOC entry 3115 (class 0 OID 0)
-- Dependencies: 233
-- Name: MenusPalabras_palabra_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MenusPalabras_palabra_seq" OWNED BY public."MenusPalabras".palabra;


--
-- TOC entry 208 (class 1259 OID 19076)
-- Name: Menus_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Menus_menu_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Menus_menu_id_seq" OWNER TO postgres;

--
-- TOC entry 3116 (class 0 OID 0)
-- Dependencies: 208
-- Name: Menus_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Menus_menu_id_seq" OWNED BY public."Menus".menu_id;


--
-- TOC entry 223 (class 1259 OID 19132)
-- Name: MetodosValidacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MetodosValidacion" (
    metodo_validacion_id smallint NOT NULL,
    metodo character varying(255) NOT NULL,
    activo boolean
);


ALTER TABLE public."MetodosValidacion" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 19136)
-- Name: MetodosValidacion_metodo_validacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MetodosValidacion_metodo_validacion_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."MetodosValidacion_metodo_validacion_id_seq" OWNER TO postgres;

--
-- TOC entry 3117 (class 0 OID 0)
-- Dependencies: 224
-- Name: MetodosValidacion_metodo_validacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MetodosValidacion_metodo_validacion_id_seq" OWNED BY public."MetodosValidacion".metodo_validacion_id;


--
-- TOC entry 209 (class 1259 OID 19078)
-- Name: Microservicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Microservicios" (
    microservicio_id smallint NOT NULL,
    name character varying(255) NOT NULL,
    hostname character varying(255) NOT NULL,
    puerto integer NOT NULL,
    url character varying(32) NOT NULL,
    activo boolean
);


ALTER TABLE public."Microservicios" OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 19084)
-- Name: Microservicios_microservicio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Microservicios_microservicio_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Microservicios_microservicio_id_seq" OWNER TO postgres;

--
-- TOC entry 3118 (class 0 OID 0)
-- Dependencies: 210
-- Name: Microservicios_microservicio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Microservicios_microservicio_id_seq" OWNED BY public."Microservicios".microservicio_id;


--
-- TOC entry 211 (class 1259 OID 19086)
-- Name: Permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permisos" (
    permiso_id smallint NOT NULL,
    entidad_id smallint,
    permiso text,
    es_publico boolean
);


ALTER TABLE public."Permisos" OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 19092)
-- Name: Permisos_permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Permisos_permiso_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Permisos_permiso_id_seq" OWNER TO postgres;

--
-- TOC entry 3119 (class 0 OID 0)
-- Dependencies: 212
-- Name: Permisos_permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Permisos_permiso_id_seq" OWNED BY public."Permisos".permiso_id;


--
-- TOC entry 215 (class 1259 OID 19099)
-- Name: Roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roles" (
    rol_id smallint NOT NULL,
    rol character varying(100) NOT NULL
);


ALTER TABLE public."Roles" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 19112)
-- Name: RolesPermisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolesPermisos" (
    rol_permiso_id smallint NOT NULL,
    rol_id smallint NOT NULL,
    permiso_id smallint
);


ALTER TABLE public."RolesPermisos" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 19115)
-- Name: RolesPermisos_roles_permisos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RolesPermisos_roles_permisos_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."RolesPermisos_roles_permisos_id_seq" OWNER TO postgres;

--
-- TOC entry 3120 (class 0 OID 0)
-- Dependencies: 218
-- Name: RolesPermisos_roles_permisos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RolesPermisos_roles_permisos_id_seq" OWNED BY public."RolesPermisos".rol_permiso_id;


--
-- TOC entry 216 (class 1259 OID 19102)
-- Name: Roles_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Roles_rol_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Roles_rol_id_seq" OWNER TO postgres;

--
-- TOC entry 3121 (class 0 OID 0)
-- Dependencies: 216
-- Name: Roles_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Roles_rol_id_seq" OWNED BY public."Roles".rol_id;


--
-- TOC entry 221 (class 1259 OID 19126)
-- Name: Usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuarios" (
    usuario_id smallint NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    activo boolean DEFAULT true,
    empresa_id smallint
);


ALTER TABLE public."Usuarios" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 19130)
-- Name: Usuarios_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Usuarios_usuario_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Usuarios_usuario_id_seq" OWNER TO postgres;

--
-- TOC entry 3122 (class 0 OID 0)
-- Dependencies: 222
-- Name: Usuarios_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuarios_usuario_id_seq" OWNED BY public."Usuarios".usuario_id;


--
-- TOC entry 2881 (class 2604 OID 19140)
-- Name: Auditorias auditoria_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Auditorias" ALTER COLUMN auditoria_id SET DEFAULT nextval('public."Auditorias_auditoria_id_seq"'::regclass);


--
-- TOC entry 2890 (class 2604 OID 19149)
-- Name: DoblesFactores doble_factor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoblesFactores" ALTER COLUMN doble_factor_id SET DEFAULT nextval('public."DoblesFactores_doble_factor_id_seq"'::regclass);


--
-- TOC entry 2895 (class 2604 OID 21417)
-- Name: Empresas empresa_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Empresas" ALTER COLUMN empresa_id SET DEFAULT nextval('public."Empresas_empresa_id_seq"'::regclass);


--
-- TOC entry 2896 (class 2604 OID 21433)
-- Name: EmpresasMenus empresa_menu_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmpresasMenus" ALTER COLUMN empresa_menu_id SET DEFAULT nextval('public."EmpresasMenus_empresa_menu_id_seq"'::regclass);


--
-- TOC entry 2887 (class 2604 OID 19145)
-- Name: Entidades entidad_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Entidades" ALTER COLUMN entidad_id SET DEFAULT nextval('public."Entidades_entidad_id_seq"'::regclass);


--
-- TOC entry 2883 (class 2604 OID 19141)
-- Name: Login login_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Login" ALTER COLUMN login_id SET DEFAULT nextval('public."Login_login_id_seq"'::regclass);


--
-- TOC entry 2897 (class 2604 OID 21494)
-- Name: MenuPersonalizado menu_pesonalizado_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenuPersonalizado" ALTER COLUMN menu_pesonalizado_id SET DEFAULT nextval('public."EmpresasMenusPersonalizado_empresa_menu_pesonalizado_id_seq"'::regclass);


--
-- TOC entry 2884 (class 2604 OID 21457)
-- Name: Menus menu_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Menus" ALTER COLUMN menu_id SET DEFAULT nextval('public."Menus_menu_id_seq"'::regclass);


--
-- TOC entry 2898 (class 2604 OID 21529)
-- Name: MenusPalabras menu_palabra_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenusPalabras" ALTER COLUMN menu_palabra_id SET DEFAULT nextval('public."MenusPalabras_menu_palabra_id_seq"'::regclass);


--
-- TOC entry 2899 (class 2604 OID 21538)
-- Name: MenusPalabras palabra; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenusPalabras" ALTER COLUMN palabra SET DEFAULT nextval('public."MenusPalabras_palabra_seq"'::regclass);


--
-- TOC entry 2894 (class 2604 OID 19151)
-- Name: MetodosValidacion metodo_validacion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MetodosValidacion" ALTER COLUMN metodo_validacion_id SET DEFAULT nextval('public."MetodosValidacion_metodo_validacion_id_seq"'::regclass);


--
-- TOC entry 2885 (class 2604 OID 19143)
-- Name: Microservicios microservicio_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Microservicios" ALTER COLUMN microservicio_id SET DEFAULT nextval('public."Microservicios_microservicio_id_seq"'::regclass);


--
-- TOC entry 2886 (class 2604 OID 19144)
-- Name: Permisos permiso_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permisos" ALTER COLUMN permiso_id SET DEFAULT nextval('public."Permisos_permiso_id_seq"'::regclass);


--
-- TOC entry 2888 (class 2604 OID 19146)
-- Name: Roles rol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles" ALTER COLUMN rol_id SET DEFAULT nextval('public."Roles_rol_id_seq"'::regclass);


--
-- TOC entry 2889 (class 2604 OID 19148)
-- Name: RolesPermisos rol_permiso_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolesPermisos" ALTER COLUMN rol_permiso_id SET DEFAULT nextval('public."RolesPermisos_roles_permisos_id_seq"'::regclass);


--
-- TOC entry 2892 (class 2604 OID 19150)
-- Name: Usuarios usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios" ALTER COLUMN usuario_id SET DEFAULT nextval('public."Usuarios_usuario_id_seq"'::regclass);


--
-- TOC entry 3069 (class 0 OID 19057)
-- Dependencies: 204
-- Data for Name: Auditorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Auditorias" (auditoria_id, login_id, status, fecha_creacion, tipo, username, rol, tiene_doble_factor) FROM stdin;
2	2	authorized	2021-04-21 15:40:31.917337	signin	usuario2	2-Commercial	t
1	2	authorized	2021-04-21 15:39:37.75942	signin	usuario2	2-Commercial	t
3	\N	unauthorized	2021-04-21 15:40:51.284106	signin	usuario28	\N	f
4	\N	unauthorized	2021-04-21 15:41:10.212207	signin	usuario3	\N	f
5	3	authorized	2021-04-21 15:41:23.538024	signin	usuario4	3-Inventory	f
6	3	authorized	2021-04-21 15:47:09.048551	signin	usuario4	3-Inventory	f
7	\N	unauthorized	2021-04-21 15:50:10.513794	signin	usuario17	\N	f
8	1	authorized	2021-04-21 15:50:18.094212	signin	usuario1	1-Administrator	t
9	1	authorized	2021-04-21 15:53:38.938274	signin	usuario1	1-Administrator	t
10	1	authorized	2021-04-21 15:57:23.442284	signin	usuario1	1-Administrator	t
11	1	authorized	2021-04-21 15:57:43.928937	signin	usuario1	1-Administrator	t
15	1	authorized	2021-04-21 16:23:51.391896	signin	usuario1	1-Administrator	t
12	3	authorized	2021-04-21 16:19:45.279844	signin	usuario4	3-Inventory	f
14	3	authorized	2021-04-21 16:23:31.458997	signin	usuario4	3-Inventory	f
13	3	authorized	2021-04-21 16:20:46.552996	signin	usuario4	3-Inventory	f
16	1	authorized	2021-04-21 17:05:36.338645	signin	usuario1	1-Administrator	t
17	1	authorized	2021-04-21 17:06:18.764521	signin	usuario1	1-Administrator	t
18	1	authorized	2021-04-22 13:16:57.756636	signin	usuario1	1-Administrator	t
19	1	authorized	2021-04-23 13:30:36.440507	signin	usuario1	1-Administrator	t
20	1	authorized	2021-04-26 17:43:32.595773	signin	usuario1	1-Administrator	t
21	1	authorized	2021-04-30 14:23:51.949652	signin	usuario1	1-Administrator	t
22	1	authorized	2021-04-30 16:12:17.731506	signin	usuario1	1-Administrator	t
23	1	authorized	2021-04-30 18:51:20.858764	signin	usuario1	1-Administrator	t
24	1	authorized	2021-05-10 16:46:50.740391	signin	usuario1	1-Administrator	t
25	1	authorized	2021-05-12 13:53:26.64252	signin	usuario1	1-Administrator	t
26	1	authorized	2021-05-12 22:04:59.028978	signin	usuario1	1-Administrator	t
27	1	authorized	2021-05-18 13:13:50.498787	signin	usuario1	1-Administrator	t
28	1	authorized	2021-05-18 22:12:54.325222	signin	usuario1	1-Administrator	t
29	1	authorized	2021-05-18 22:59:18.53173	signin	usuario1	1-Administrator	t
30	1	authorized	2021-05-18 23:01:25.961362	signin	usuario1	1-Administrator	t
31	1	authorized	2021-05-19 13:25:41.538852	signin	usuario1	1-Administrator	t
32	1	authorized	2021-05-19 13:44:08.298792	signin	usuario1	1-Administrator	t
33	1	authorized	2021-05-19 21:22:41.951201	signin	usuario1	1-Administrator	t
34	1	authorized	2021-05-19 21:28:13.398471	signin	usuario1	1-Administrator	t
35	\N	unauthorized	2021-05-19 21:29:10.369406	signin	usuario11	\N	f
36	1	authorized	2021-05-19 21:29:13.907727	signin	usuario1	1-Administrator	t
37	1	authorized	2021-05-19 23:19:15.979971	signin	usuario1	1-Administrator	t
38	1	authorized	2021-05-19 23:21:11.393433	signin	usuario1	1-Administrator	t
39	1	authorized	2021-05-20 13:27:03.916388	signin	usuario1	1-Administrator	t
40	1	authorized	2021-05-20 13:29:26.739064	signin	usuario1	1-Administrator	t
41	2	authorized	2021-05-20 13:31:32.215507	signin	usuario2	2-Commercial	f
42	1	authorized	2021-05-20 13:33:21.113491	signin	usuario1	1-Administrator	t
43	1	authorized	2021-05-20 13:52:03.599979	signin	usuario1	1-Administrator	t
44	1	authorized	2021-05-20 17:13:01.115397	signin	usuario1	1-Administrator	t
45	1	authorized	2021-05-20 17:14:07.431317	signin	usuario1	1-Administrator	t
46	1	authorized	2021-05-20 17:14:12.976657	signin	usuario1	1-Administrator	t
47	1	authorized	2021-05-20 17:14:47.353163	signin	usuario1	1-Administrator	t
48	1	authorized	2021-05-20 17:15:58.913898	signin	usuario1	1-Administrator	t
49	1	authorized	2021-05-20 17:16:30.437695	signin	usuario1	1-Administrator	t
50	1	authorized	2021-05-20 17:19:47.393532	signin	usuario1	1-Administrator	t
51	1	authorized	2021-05-20 17:19:48.155741	signin	usuario1	1-Administrator	t
52	1	authorized	2021-05-20 17:19:48.475153	signin	usuario1	1-Administrator	t
53	1	authorized	2021-05-20 17:19:48.798638	signin	usuario1	1-Administrator	t
54	1	authorized	2021-05-20 17:22:07.035023	signin	usuario1	1-Administrator	t
55	1	authorized	2021-05-20 17:22:19.555838	signin	usuario1	1-Administrator	t
56	1	authorized	2021-05-20 17:23:38.084212	signin	usuario1	1-Administrator	t
57	1	authorized	2021-05-20 17:24:32.974295	signin	usuario1	1-Administrator	t
58	1	authorized	2021-05-20 17:25:01.394109	signin	usuario1	1-Administrator	t
59	1	authorized	2021-05-20 17:30:18.134438	signin	usuario1	1-Administrator	t
60	1	authorized	2021-05-20 17:31:05.69968	signin	usuario1	1-Administrator	t
61	1	authorized	2021-05-20 17:31:12.774036	signin	usuario1	1-Administrator	t
62	1	authorized	2021-05-20 19:23:50.92035	signin	usuario1	1-Administrator	t
63	1	authorized	2021-05-21 12:53:13.19289	signin	usuario1	1-Administrator	t
64	1	authorized	2021-05-21 12:55:14.028821	signin	usuario1	1-Administrator	t
65	1	authorized	2021-05-21 13:16:49.525935	signin	usuario1	1-Administrator	t
66	1	authorized	2021-05-21 13:18:13.488494	signin	usuario1	1-Administrator	t
67	2	authorized	2021-05-21 13:18:33.891497	signin	usuario2	2-Commercial	t
68	2	authorized	2021-05-21 13:18:47.809831	signin	usuario2	2-Commercial	t
69	2	authorized	2021-05-21 13:21:00.512825	signin	usuario2	2-Commercial	t
70	2	authorized	2021-05-21 13:21:50.656971	signin	usuario2	2-Commercial	t
71	2	authorized	2021-05-21 13:23:53.094118	signin	usuario2	2-Commercial	t
72	2	authorized	2021-05-21 13:24:22.856483	signin	usuario2	2-Commercial	t
73	2	authorized	2021-05-21 13:26:22.521564	signin	usuario2	2-Commercial	t
74	2	authorized	2021-05-21 13:27:47.485392	signin	usuario2	2-Commercial	t
75	2	authorized	2021-05-21 13:28:37.529583	signin	usuario2	2-Commercial	t
76	1	authorized	2021-05-21 14:06:45.948655	signin	usuario1	1-Administrator	t
77	1	authorized	2021-05-24 13:28:07.965996	signin	usuario1	1-Administrator	t
78	1	authorized	2021-05-24 18:16:30.616471	signin	usuario1	1-Administrator	t
79	1	authorized	2021-05-25 16:07:48.788072	signin	usuario1	1-Administrator	t
80	\N	authorized	2021-05-26 21:38:27.20713	signin	usuario1	2-Commercial	\N
81	\N	authorized	2021-05-26 21:38:43.139134	signin	usuario1	2-Commercial	\N
82	\N	authorized	2021-05-26 21:40:47.677786	signin	usuario1	2-Commercial	\N
83	\N	authorized	2021-05-26 21:40:59.366441	signin	usuario1	2-Commercial	\N
84	\N	authorized	2021-05-26 21:41:49.745654	signin	usuario1	2-Commercial	\N
85	\N	authorized	2021-05-26 21:42:56.864927	signin	usuario1	2-Commercial	\N
86	\N	authorized	2021-05-26 21:43:02.349457	signin	usuario1	2-Commercial	\N
87	\N	authorized	2021-05-26 21:43:06.850145	signin	usuario1	2-Commercial	\N
88	\N	authorized	2021-05-26 21:49:27.427476	signin	usuario1	2-Commercial	\N
89	\N	authorized	2021-05-26 21:51:45.668196	signin	usuario1	2-Commercial	\N
90	\N	authorized	2021-05-27 14:07:34.842234	signin	usuario1	2-Commercial	\N
91	\N	authorized	2021-05-28 15:22:20.640483	signin	usuario1	2-Commercial	\N
92	\N	authorized	2021-05-31 13:21:48.311662	signin	usuario1	2-Commercial	\N
93	\N	authorized	2021-05-31 20:23:51.06925	signin	usuario1	2-Commercial	\N
94	\N	authorized	2021-06-01 15:11:57.356344	signin	usuario1	2-Commercial	\N
95	\N	unauthorized	2021-06-01 15:14:39.235762	signin	usuario1	\N	f
96	\N	unauthorized	2021-06-01 21:22:10.407783	signin	usuario1	\N	f
97	\N	authorized	2021-06-01 21:22:15.173822	signin	usuario1	2-Commercial	\N
98	\N	authorized	2021-06-02 00:23:25.609708	signin	usuario1	2-Commercial	\N
99	\N	authorized	2021-06-02 00:48:58.361483	signin	usuario1	2-Commercial	\N
100	\N	authorized	2021-06-02 00:50:37.59703	signin	usuario1	2-Commercial	\N
101	\N	authorized	2021-06-02 00:51:16.661716	signin	usuario1	2-Commercial	\N
102	\N	authorized	2021-06-02 00:53:19.054574	signin	usuario1	2-Commercial	\N
103	\N	authorized	2021-06-02 00:54:03.89737	signin	usuario1	2-Commercial	\N
104	\N	authorized	2021-06-02 00:56:10.202125	signin	usuario2	2-Commercial	\N
105	\N	authorized	2021-06-02 00:56:52.710058	signin	usuario2	2-Commercial	\N
106	\N	unauthorized	2021-06-02 00:57:36.395232	signin	usuario1	\N	f
107	\N	authorized	2021-06-02 00:57:41.356557	signin	usuario1	2-Commercial	\N
108	\N	unauthorized	2021-06-02 12:59:30.058681	signin	usuario1	\N	f
109	\N	unauthorized	2021-06-02 12:59:36.264549	signin	usuario1	\N	f
110	\N	authorized	2021-06-02 12:59:40.552342	signin	usuario1	2-Commercial	\N
111	\N	authorized	2021-06-04 13:25:47.927609	signin	usuario1	2-Commercial	\N
112	\N	authorized	2021-06-04 17:22:21.538393	signin	usuario1	2-Commercial	\N
113	\N	authorized	2021-06-04 17:24:42.255126	signin	usuario1	2-Commercial	\N
114	\N	authorized	2021-06-04 19:28:01.069817	signin	usuario1	2-Commercial	\N
115	\N	authorized	2021-06-08 13:11:22.381785	signin	usuario1	2-Commercial	\N
116	\N	authorized	2021-06-08 14:10:13.830681	signin	usuario1	2-Commercial	\N
117	\N	authorized	2021-06-08 14:11:14.338329	signin	usuario1	2-Commercial	\N
118	\N	authorized	2021-06-08 14:11:52.727718	signin	usuario1	2-Commercial	\N
119	\N	authorized	2021-06-08 15:04:26.579497	signin	usuario1	2-Commercial	\N
120	\N	unauthorized	2021-06-08 15:30:31.779912	signin	usuario1	\N	f
121	\N	authorized	2021-06-08 15:30:35.677456	signin	usuario1	2-Commercial	\N
122	\N	authorized	2021-06-08 15:32:41.914087	signin	usuario1	2-Commercial	\N
123	\N	authorized	2021-06-08 15:34:28.477519	signin	usuario1	2-Commercial	\N
124	\N	authorized	2021-06-08 15:54:14.092881	signin	usuario1	2-Commercial	\N
125	\N	authorized	2021-06-08 16:10:36.843503	signin	usuario1	2-Commercial	\N
126	\N	authorized	2021-06-08 16:12:30.880049	signin	usuario1	2-Commercial	\N
127	\N	authorized	2021-06-08 16:12:40.943004	signin	usuario1	2-Commercial	\N
128	\N	authorized	2021-06-08 16:12:50.074937	signin	usuario1	2-Commercial	\N
129	\N	authorized	2021-06-08 16:50:51.834393	signin	usuario1	2-Commercial	\N
\.


--
-- TOC entry 3084 (class 0 OID 19117)
-- Dependencies: 219
-- Data for Name: DoblesFactores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DoblesFactores" (doble_factor_id, otplib_secreta, esta_configurado, login_id, codigo_recuperacion, metodo_validacion_id, fecha_creacion_codigo) FROM stdin;
1	HE6TWF2WAVTWK23J	t	1	FlVfgU1q3vMOsXyDskUx	1	\N
2	\N	f	2	$2b$10$tto94NATru7NdjZ0lIMv5.AN/dc0OEmfXw0EA31ACeLKL1bv.iLsC	2	2021-06-02 00:56:52.987
\.


--
-- TOC entry 3092 (class 0 OID 21414)
-- Dependencies: 227
-- Data for Name: Empresas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Empresas" (empresa_id, nombre) FROM stdin;
2	Tiresia 2
1	Tiresia 1
\.


--
-- TOC entry 3094 (class 0 OID 21430)
-- Dependencies: 229
-- Data for Name: EmpresasMenus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmpresasMenus" (empresa_menu_id, empresa_id, menu_id) FROM stdin;
1	1	2
2	1	4
3	1	5
4	1	6
5	1	7
6	1	10
7	1	11
8	1	12
9	1	14
10	1	16
11	1	19
12	2	2
13	2	5
14	2	6
15	2	7
16	2	11
17	2	18
18	2	19
\.


--
-- TOC entry 3078 (class 0 OID 19094)
-- Dependencies: 213
-- Data for Name: Entidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Entidades" (entidad_id, nombre, resolver) FROM stdin;
1	Menus	MenusResolver
10	Caracteristicas	CaracteristicasResolver
12	CategoriasPrecios	CategoriasPreciosResolver
14	Margenes	MargenesResolver
16	ProductosCategoriasContables	ProductosCategoriasContablesResolver
18	ProductosImagenes	ProductosImagenesResolver
20	ProductosProveedores	ProductosProveedoresResolver
22	Proveedores	ProveedoresResolver
24	Unspsc	UnspscResolver
40	UnidadesMedida	UnidadesMedidaResolver
4	Permisos	PermisosResolver
3	Auditorias	AuditoriasResolver
6	RolesPermisos	RolesPermisosResolver
8	Productos	ProductosResolver
11	Estantes	EstantesResolver
13	LineaBodegas	LineaBodegasResolver
15	ProductosCaracteristicas	ProductosCaracteristicasResolver
17	ProductosDescuentos	ProductosDescuentosResolver
19	ProductosPacks	ProductosPacksResolver
21	ProductosTipoImpuestos	ProductosTipoImpuestosResolver
23	TipoImpuestos	TipoImpuestosResolver
25	FabricanteLineas	FabricanteLineasResolver
28	Invima	InvimaResolver
31	ProductosAranceles	ProductosArancelesResolver
34	ProductosDimensiones	ProductosDimensionesResolver
36	ProductosPrecios	ProductosPreciosResolver
38	TeleferiaCantidades	TeleferiaCantidadesResolver
5	Login	LoginResolver
9	Bodegas	BodegasResolver
26	CategoriasDescuentos	CategoriasDescuentosResolver
29	Dimension	DimensionResolver
32	ProductosCategorias	ProductosCategoriasResolver
35	ProductosMargenes	ProductosMargenesResolver
39	ProductosUbicaciones	ProductosUbicacionesResolver
41	Usuarioservice	Usuarioservice
42	Usuarios	UsuariosResolver
43	EmpresasMenus	EmpresasMenusResolver
44	MenusPalabras	MenusPalabrasResolver
2	Roles	RolesResolver
7	DoblesFactores	DoblesFactoresResolver
27	Depositos	DepositosResolver
30	Magnitudes	MagnitudesResolver
33	ProductosCodigos	ProductosCodigosResolver
37	ProductosReemplazos	ProductosReemplazosResolver
\.


--
-- TOC entry 3070 (class 0 OID 19061)
-- Dependencies: 205
-- Data for Name: Login; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Login" (login_id, username, password, token, salt, rol_id, tiene_doble_factor, usuario_id) FROM stdin;
3	usuario4	$2b$10$seOm91q6A/T1Vp81lgwzl.MZdm1MrVtt5clB3XHNkZtyiMyr01BUe	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTYxOTAyMjIxMSwiZXhwIjoxNjE5MTk1MDExfQ.uIud3VLBAE7sfUbAFA0Y1a9b9Vje8Jem6lC6l68_YZk	$2b$10$seOm91q6A/T1Vp81lgwzl.	3	0	3
1	usuario1	$2b$10$4nfNtxvEvo15ot5t4kJu/OGD/zRB0TO5IasIdDN/Hfp9l8cBImHLS	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyMzE3MTA1MSwiZXhwIjoxNjIzMzQzODUxfQ.s6cJyKtXfaKHOuokYYhb7-3K13WaG7T8YVS9kvsGFrg	$2b$10$4nfNtxvEvo15ot5t4kJu/O	1	0	1
2	usuario2	$2b$10$tto94NATru7NdjZ0lIMv5.ko1Zmms5puWonOoISgvJ62oXoGacbNy	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTYyMjU5NTQxMiwiZXhwIjoxNjIyNzY4MjEyfQ.4cCBBbAsE9HlUcHWY2wKF9wlh93v57w-w9Gi3tX-Dn8	$2b$10$tto94NATru7NdjZ0lIMv5.	2	0	2
\.


--
-- TOC entry 3096 (class 0 OID 21491)
-- Dependencies: 231
-- Data for Name: MenuPersonalizado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MenuPersonalizado" (menu_pesonalizado_id, empresa_id, menu) FROM stdin;
1	1	{"menu_id":1,"title":"menu","path":"/","isEntity":false,"order":null,"level":null,"parentMenuId":null,"MenusPalabras":[],"other_Menus":[{"menu_id":2,"title":"Administración","path":"/administración","isEntity":false,"order":1,"level":1,"MenusPalabras":[{"palabra":"administracion"},{"palabra":"admon"}],"other_Menus":[{"menu_id":6,"title":"Configuración","path":"/administración/configuración","isEntity":false,"order":1,"level":2,"MenusPalabras":[],"other_Menus":[]},{"menu_id":7,"title":"Usuarios","path":"/administración/usuarios","isEntity":false,"order":2,"level":2,"MenusPalabras":[],"other_Menus":[{"menu_id":11,"title":"Usuarios","path":"/administración/usuarios/usuarios","isEntity":true,"parentMenuId":7,"entidad_id":42,"order":1,"level":3},{"menu_id":12,"title":"Doble Factor","path":"/administración/usuarios/doblefactor","isEntity":true,"parentMenuId":7,"entidad_id":7,"order":3,"level":3}]}]},{"menu_id":5,"title":"Recursos Humanos","path":"/recursoshumanos","isEntity":false,"order":4,"level":1,"MenusPalabras":[],"other_Menus":[{"menu_id":19,"title":"Cuentas","path":"/recursoshumanos/cuentas","isEntity":false,"order":2,"level":2,"MenusPalabras":[],"other_Menus":[]}]},{"menu_id":4,"title":"Inventario","path":"/inventario","isEntity":false,"order":2,"level":1,"MenusPalabras":[{"palabra":"inventario"}],"other_Menus":[{"menu_id":10,"title":"Productos","path":"/inventario/productos","isEntity":false,"order":2,"level":2,"MenusPalabras":[],"other_Menus":[{"menu_id":14,"title":"Productos","path":"/inventario/productos/productos","isEntity":true,"parentMenuId":10,"entidad_id":8,"order":1,"level":3}]},{"menu_id":16,"title":"Bodegas","path":"/inventario/bodegas","isEntity":true,"order":3,"level":2,"MenusPalabras":[],"other_Menus":[]}]}]}
2	2	{"menu_id":1,"title":"menu","path":"/","isEntity":false,"order":null,"level":null,"parentMenuId":null,"MenusPalabras":[],"other_Menus":[{"menu_id":2,"title":"Administración","path":"/administración","isEntity":false,"order":1,"level":1,"MenusPalabras":[{"palabra":"administracion"},{"palabra":"admon"}],"other_Menus":[{"menu_id":6,"title":"Configuración","path":"/administración/configuración","isEntity":false,"order":1,"level":2,"MenusPalabras":[],"other_Menus":[]},{"menu_id":7,"title":"Usuarios","path":"/administración/usuarios","isEntity":false,"order":2,"level":2,"MenusPalabras":[],"other_Menus":[{"menu_id":11,"title":"Usuarios","path":"/administración/usuarios/usuarios","isEntity":true,"parentMenuId":7,"entidad_id":42,"order":1,"level":3}]}]},{"menu_id":5,"title":"Recursos Humanos","path":"/recursoshumanos","isEntity":false,"order":4,"level":1,"MenusPalabras":[],"other_Menus":[{"menu_id":18,"title":"Nómina","path":"/recursoshumanos/nómina","isEntity":false,"order":1,"level":2,"MenusPalabras":[],"other_Menus":[]},{"menu_id":19,"title":"Cuentas","path":"/recursoshumanos/cuentas","isEntity":false,"order":2,"level":2,"MenusPalabras":[],"other_Menus":[]}]}]}
\.


--
-- TOC entry 3072 (class 0 OID 19070)
-- Dependencies: 207
-- Data for Name: Menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Menus" (menu_id, title, path, "isEntity", "parentMenuId", entidad_id, "order", level) FROM stdin;
1	menu	/	f	\N	\N	\N	\N
2	Administración	/administración	f	1	\N	1	1
5	Recursos Humanos	/recursoshumanos	f	1	\N	4	1
4	Inventario	/inventario	f	1	\N	2	1
3	General	/general	f	1	\N	3	1
6	Configuración	/administración/configuración	f	2	\N	1	2
7	Usuarios	/administración/usuarios	f	2	\N	2	2
8	Reportes	/general/reportes	f	3	\N	1	2
9	Contabilidad	/inventario/contabilidad	f	4	\N	1	2
10	Productos	/inventario/productos	f	4	\N	2	2
11	Usuarios	/administración/usuarios/usuarios	t	7	42	1	3
12	Doble Factor	/administración/usuarios/doblefactor	t	7	7	3	3
13	Auditorias	/administración/usuarios/auditorias	t	7	3	2	3
14	Productos	/inventario/productos/productos	t	10	8	1	3
15	Productos Descuentos	/inventario/productos/productosdescuentos	t	10	17	2	3
16	Bodegas	/inventario/bodegas	t	4	9	3	2
17	Caracteristicas	/inventario/caracteristicas	t	4	10	4	2
18	Nómina	/recursoshumanos/nómina	f	5	\N	1	2
19	Cuentas	/recursoshumanos/cuentas	f	5	\N	2	2
\.


--
-- TOC entry 3099 (class 0 OID 21526)
-- Dependencies: 234
-- Data for Name: MenusPalabras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MenusPalabras" (menu_palabra_id, menu_id, palabra) FROM stdin;
1	2	administracion
2	3	general
3	4	inventario
4	2	admon
\.


--
-- TOC entry 3088 (class 0 OID 19132)
-- Dependencies: 223
-- Data for Name: MetodosValidacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MetodosValidacion" (metodo_validacion_id, metodo, activo) FROM stdin;
2	Email	t
1	TOTP	t
3	SMS	f
\.


--
-- TOC entry 3074 (class 0 OID 19078)
-- Dependencies: 209
-- Data for Name: Microservicios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Microservicios" (microservicio_id, name, hostname, puerto, url, activo) FROM stdin;
1	admin	localhost	3000	http://localhost:3000/graphql	t
2	inventario	localhost	3001	http://localhost:3001/graphql	f
\.


--
-- TOC entry 3076 (class 0 OID 19086)
-- Dependencies: 211
-- Data for Name: Permisos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permisos" (permiso_id, entidad_id, permiso, es_publico) FROM stdin;
234	42	getUsuarios	f
256	44	deleteMenuPalabra	f
248	43	getEmpresasMenusByRoleId	f
2	1	MenusResolver	f
246	43	getEmpresasMenusByEmpresaId	f
19	7	getDobleFactorById	f
135	37	getProductoReemplazoById	f
53	10	deleteCaracteristica	f
76	11	getEstanteById	f
110	15	getProductoCaracteristicas	f
40	25	createFabricanteLinea	f
66	11	getEstantes	f
141	36	getProductoPrecios	f
88	27	DepositosResolver	f
69	29	DimensionResolver	f
145	37	ProductosReemplazosResolver	f
90	27	updateDeposito	f
105	35	getProductoMargenById	f
46	27	deleteDeposito	f
39	9	BodegasResolver	f
85	12	updateCategoriaPrecio	f
78	27	getDepositoById	f
118	33	getProductoCodigoById	f
233	1	getMenuByRolId	f
56	25	FabricanteLineasResolver	f
68	12	CategoriasPreciosResolver	f
51	9	getBodegas	f
42	26	getCategoriasDescuentos	f
74	29	getDimensionById	f
35	8	createProducto	f
38	8	deleteProducto	f
111	15	createProductoCaracteristica	f
49	9	createBodega	f
137	37	updateProductoReemplazo	f
112	15	deleteProductoCaracteristica	f
80	28	InvimaResolver	f
30	7	exSetActivateConfigDobleFactorTOTP	t
65	10	updateCaracteristica	f
52	10	createCaracteristica	f
142	30	MagnitudesResolver	f
125	37	getProductoReemplazos	f
84	29	updateDimension	f
96	11	deleteEstante	f
77	28	updateInvima	f
107	20	deleteProductoProveedor	f
13	1	filteredMenuForRoleId	f
3	5	LoginResolver	f
119	33	updateProductoCodigo	f
131	33	getProductoCodigos	f
122	35	updateProductoMargen	f
104	18	createProductoImagen	f
73	13	getLineaBodegaById	f
230	5	changePasswordLogin	f
95	13	deleteLineaBodega	f
116	16	ProductosCategoriasContablesResolver	f
113	32	getProductoCategoriaById	f
11	7	exSendMail	t
82	13	updateLineaBodega	f
81	13	LineaBodegasResolver	f
144	30	getMagnitudes	f
92	11	createEstante	f
124	16	deleteProductoCategoriaContable	f
12	7	exValidateDobleFactorCode	t
103	18	getProductoImagens	f
115	32	deleteProductoCategoria	f
139	20	getProductoProveedores	f
242	1	getFilterMenuByRolId	f
109	31	deleteProductoArancel	f
123	20	getProductoProveedorById	f
108	31	getProductoAranceles	f
132	18	updateProductoImagen	f
106	19	getProductoPackById	f
100	19	getProductoPacks	f
130	36	createProductoPrecio	f
63	29	createDimension	f
54	10	getCaracteristicas	f
129	32	updateProductoCategoria	f
48	29	deleteDimension	f
4	5	getLoginById	f
134	17	getProductoDescuentoById	f
61	29	getDimensions	f
86	26	updateCategoriaDescuento	f
6	5	signUpLogin	f
117	16	getProductoCategoriaContables	f
89	26	getCategoriaDescuentoById	f
120	31	ProductosArancelesResolver	f
58	12	deleteCategoriaPrecio	f
70	10	getCaracteristicaById	f
23	7	createDobleFactor	f
79	11	updateEstante	f
14	1	rootMenu	f
114	32	createProductoCategoria	f
83	28	getInvimaById	f
126	14	getMargenById	f
101	35	getProductoMargens	f
33	8	getFilterProductos	f
24	7	getDobleFactorByLoginId	f
241	42	deleteUsuario	f
34	8	getProductos	f
128	15	getProductoCaracteristicaById	f
102	34	deleteProductoDimension	f
99	35	deleteProductoMargen	f
22	4	PermisosResolver	f
17	1	createFolder	f
240	41	Usuarioservice	f
50	9	deleteBodega	f
133	35	ProductosMargenesResolver	f
98	35	createProductoMargen	f
20	3	getAuditorias	f
143	20	updateProductoProveedor	f
15	5	getLogin	f
252	5	addComment	t
1	1	insertEntityToFolder	f
37	25	deleteFabricanteLinea	f
9	3	AuditoriasResolver	f
64	9	getBodegaById	f
43	26	createCategoriaDescuento	f
75	26	CategoriasDescuentosResolver	f
127	37	createProductoReemplazo	f
140	36	deleteProductoPrecio	f
136	20	createProductoProveedor	f
45	27	getDepositos	f
47	25	getFabricanteLineaById	f
60	27	createDeposito	f
16	5	signInLogin	f
251	5	validateToken	t
55	25	updateFabricanteLinea	f
255	5	commentAdded	t
31	8	ProductosResolver	f
36	8	updateProducto	f
44	12	createCategoriaPrecio	f
186	18	deleteProductoImagen	f
94	13	getLineaBodegas	f
87	12	getCategoriaPrecioById	f
168	16	getProductoCategoriaContableById	f
152	36	ProductosPreciosResolver	f
121	19	deleteProductoPack	f
159	14	getMargens	f
150	30	getMagnitudById	f
162	31	getProductoArancelById	f
165	15	updateProductoCaracteristica	f
156	30	createMagnitud	f
146	30	updateMagnitud	f
171	33	ProductosCodigosResolver	f
174	17	ProductosDescuentosResolver	f
178	17	deleteProductoDescuento	f
182	34	updateProductoDimension	f
228	39	updateProductoUbicacion	f
221	21	updateProductoTipoImpuesto	f
211	39	ProductosUbicacionesResolver	f
190	38	createTeleferiaCantidad	f
138	37	deleteProductoReemplazo	f
224	39	deleteProductoUbicacion	f
213	22	createProveedor	f
201	21	ProductosTipoImpuestosResolver	f
194	23	deleteTipoImpuesto	f
198	24	createUnspsc	f
207	24	updateUnspsc	f
243	1	updateMenu	f
28	4	getPermisos	f
244	43	getEmpresasMenus	f
231	5	exChangePasswordLogin	t
29	2	RolesResolver	f
257	44	getMenusPalabras	f
245	43	EmpresasMenusResolver	f
250	43	getEmpresaMenuByRoleId	f
247	43	updateMenuPersonalizado	f
5	1	createRootMenu	f
259	44	getMenuPalabraById	f
21	6	RolesPermisosResolver	f
235	42	updateUsuario	f
238	42	createUsuario	f
249	43	getEmpresaMenuByEmpresaId	f
253	5	getT	t
254	5	addCommentHandler	t
258	44	createMenuPalabra	f
32	8	getProductoById	f
62	9	updateBodega	f
71	28	getInvimas	f
170	16	updateProductoCategoriaContable	f
158	14	createMargen	f
164	31	updateProductoArancel	f
147	30	deleteMagnitud	f
161	14	deleteMargen	f
151	19	updateProductoPack	f
167	32	getProductoCategorias	f
177	17	getProductoDescuentos	f
185	18	getProductoImagenById	f
181	34	createProductoDimension	f
173	33	deleteProductoCodigo	f
206	23	updateTipoImpuesto	f
216	23	getTipoImpuestoById	f
219	22	deleteProveedor	f
155	20	ProductosProveedoresResolver	f
209	38	deleteTeleferiaCantidad	f
203	38	getTeleferiaCantidades	f
193	23	createTipoImpuesto	f
227	21	createProductoTipoImpuesto	f
189	38	TeleferiaCantidadesResolver	f
197	40	getUnidadMedidaById	f
223	22	ProveedoresResolver	f
260	44	updateMenuPalabra	f
7	7	DoblesFactoresResolver	f
18	5	logOutLogin	f
232	1	getMenus	f
8	2	getRoles	f
26	7	configDobleFactor	f
236	41	createUsuario	f
41	25	getFabricanteLineas	f
59	12	getCategoriaPrecios	f
93	28	deleteInvima	f
91	11	EstantesResolver	f
97	28	createInvima	f
184	18	ProductosImagenesResolver	f
148	15	ProductosCaracteristicasResolver	f
154	19	createProductoPack	f
176	17	updateProductoDescuento	f
180	34	getProductoDimensionById	f
204	21	getProductoTipoImpuestos	f
208	40	deleteUnidadMedida	f
215	21	deleteProductoTipoImpuesto	f
188	22	getProveedorById	f
200	39	createProductoUbicacion	f
226	22	getProveedors	f
192	23	TipoImpuestosResolver	f
210	21	getProductoTipoImpuestoById	f
196	40	getUnidadMedidas	f
218	24	UnspscResolver	f
27	7	exValidateRecoveryCode	t
25	6	getRolesPermisos	f
261	44	MenusPalabrasResolver	f
237	42	getUsuarios	f
57	26	deleteCategoriaDescuento	f
67	10	CaracteristicasResolver	f
72	13	createLineaBodega	f
166	32	ProductosCategoriasResolver	f
160	14	updateMargen	f
163	31	createProductoArancel	f
169	16	createProductoCategoriaContable	f
157	14	MargenesResolver	f
187	19	ProductosPacksResolver	f
172	33	createProductoCodigo	f
183	34	getProductoDimensiones	f
179	34	ProductosDimensionesResolver	f
175	17	createProductoDescuento	f
199	24	deleteUnspsc	f
191	38	updateTeleferiaCantidad	f
225	39	getProductoUbicacionById	f
202	38	getTeleferiaCantidadById	f
153	36	updateProductoPrecio	f
149	36	getProductoPrecioById	f
214	23	getTipoImpuestos	f
195	40	UnidadesMedidaResolver	f
217	22	updateProveedor	f
212	39	getProductoUbicacions	f
222	40	createUnidadMedida	f
229	40	updateUnidadMedida	f
205	24	getUnspscs	f
220	24	getUnspscById	f
239	42	UsuariosResolver	f
10	7	exValidationCodeMail	t
\.


--
-- TOC entry 3080 (class 0 OID 19099)
-- Dependencies: 215
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roles" (rol_id, rol) FROM stdin;
2	Commercial
3	Inventory
1	Administrator
\.


--
-- TOC entry 3082 (class 0 OID 19112)
-- Dependencies: 217
-- Data for Name: RolesPermisos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolesPermisos" (rol_permiso_id, rol_id, permiso_id) FROM stdin;
1	1	31
2	1	3
3	1	7
4	1	2
6	1	8
5	1	28
8	1	239
9	1	245
10	2	39
7	2	7
11	2	245
12	1	261
\.


--
-- TOC entry 3086 (class 0 OID 19126)
-- Dependencies: 221
-- Data for Name: Usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuarios" (usuario_id, nombre, email, activo, empresa_id) FROM stdin;
3	Yaky Sánchez	yaky0723@gmail.com	t	\N
4	Test	test1@gmail.com	t	\N
1	Johán Cardona	jscardona42@gmail.com	t	1
2	Test	jscardona42@gmail.com	t	2
\.


--
-- TOC entry 3123 (class 0 OID 0)
-- Dependencies: 225
-- Name: Auditorias_auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Auditorias_auditoria_id_seq"', 129, true);


--
-- TOC entry 3124 (class 0 OID 0)
-- Dependencies: 220
-- Name: DoblesFactores_doble_factor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DoblesFactores_doble_factor_id_seq"', 2, true);


--
-- TOC entry 3125 (class 0 OID 0)
-- Dependencies: 230
-- Name: EmpresasMenusPersonalizado_empresa_menu_pesonalizado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EmpresasMenusPersonalizado_empresa_menu_pesonalizado_id_seq"', 2, true);


--
-- TOC entry 3126 (class 0 OID 0)
-- Dependencies: 228
-- Name: EmpresasMenus_empresa_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EmpresasMenus_empresa_menu_id_seq"', 18, true);


--
-- TOC entry 3127 (class 0 OID 0)
-- Dependencies: 226
-- Name: Empresas_empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Empresas_empresa_id_seq"', 1, true);


--
-- TOC entry 3128 (class 0 OID 0)
-- Dependencies: 214
-- Name: Entidades_entidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Entidades_entidad_id_seq"', 44, true);


--
-- TOC entry 3129 (class 0 OID 0)
-- Dependencies: 206
-- Name: Login_login_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Login_login_id_seq"', 8, true);


--
-- TOC entry 3130 (class 0 OID 0)
-- Dependencies: 232
-- Name: MenusPalabras_menu_palabra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MenusPalabras_menu_palabra_id_seq"', 4, true);


--
-- TOC entry 3131 (class 0 OID 0)
-- Dependencies: 233
-- Name: MenusPalabras_palabra_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MenusPalabras_palabra_seq"', 1, false);


--
-- TOC entry 3132 (class 0 OID 0)
-- Dependencies: 208
-- Name: Menus_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Menus_menu_id_seq"', 20, true);


--
-- TOC entry 3133 (class 0 OID 0)
-- Dependencies: 224
-- Name: MetodosValidacion_metodo_validacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MetodosValidacion_metodo_validacion_id_seq"', 3, true);


--
-- TOC entry 3134 (class 0 OID 0)
-- Dependencies: 210
-- Name: Microservicios_microservicio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Microservicios_microservicio_id_seq"', 2, true);


--
-- TOC entry 3135 (class 0 OID 0)
-- Dependencies: 212
-- Name: Permisos_permiso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Permisos_permiso_id_seq"', 261, true);


--
-- TOC entry 3136 (class 0 OID 0)
-- Dependencies: 218
-- Name: RolesPermisos_roles_permisos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RolesPermisos_roles_permisos_id_seq"', 12, true);


--
-- TOC entry 3137 (class 0 OID 0)
-- Dependencies: 216
-- Name: Roles_rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Roles_rol_id_seq"', 3, true);


--
-- TOC entry 3138 (class 0 OID 0)
-- Dependencies: 222
-- Name: Usuarios_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuarios_usuario_id_seq"', 4, true);


--
-- TOC entry 2927 (class 2606 OID 21506)
-- Name: MenuPersonalizado EmpresasMenusPersonalizado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenuPersonalizado"
    ADD CONSTRAINT "EmpresasMenusPersonalizado_pkey" PRIMARY KEY (menu_pesonalizado_id);


--
-- TOC entry 2925 (class 2606 OID 21438)
-- Name: EmpresasMenus EmpresasMenus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmpresasMenus"
    ADD CONSTRAINT "EmpresasMenus_pkey" PRIMARY KEY (empresa_menu_id);


--
-- TOC entry 2923 (class 2606 OID 21419)
-- Name: Empresas Empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Empresas"
    ADD CONSTRAINT "Empresas_pkey" PRIMARY KEY (empresa_id);


--
-- TOC entry 2903 (class 2606 OID 19153)
-- Name: Login Login_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Login"
    ADD CONSTRAINT "Login_pkey" PRIMARY KEY (login_id);


--
-- TOC entry 2929 (class 2606 OID 21532)
-- Name: MenusPalabras MenusPalabras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenusPalabras"
    ADD CONSTRAINT "MenusPalabras_pkey" PRIMARY KEY (menu_palabra_id);


--
-- TOC entry 2905 (class 2606 OID 21459)
-- Name: Menus Menus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Menus"
    ADD CONSTRAINT "Menus_pkey" PRIMARY KEY (menu_id);


--
-- TOC entry 2907 (class 2606 OID 19274)
-- Name: Microservicios Microservices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Microservicios"
    ADD CONSTRAINT "Microservices_pkey" PRIMARY KEY (microservicio_id);


--
-- TOC entry 2909 (class 2606 OID 19159)
-- Name: Permisos Permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permisos"
    ADD CONSTRAINT "Permissions_pkey" PRIMARY KEY (permiso_id);


--
-- TOC entry 2911 (class 2606 OID 19161)
-- Name: Entidades Permissions_principal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Entidades"
    ADD CONSTRAINT "Permissions_principal_pkey" PRIMARY KEY (entidad_id);


--
-- TOC entry 2915 (class 2606 OID 19294)
-- Name: RolesPermisos Roles_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolesPermisos"
    ADD CONSTRAINT "Roles_permissions_pkey" PRIMARY KEY (rol_permiso_id);


--
-- TOC entry 2913 (class 2606 OID 19167)
-- Name: Roles Roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY (rol_id);


--
-- TOC entry 2917 (class 2606 OID 19227)
-- Name: DoblesFactores Twofactor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoblesFactores"
    ADD CONSTRAINT "Twofactor_pkey" PRIMARY KEY (doble_factor_id);


--
-- TOC entry 2919 (class 2606 OID 19171)
-- Name: Usuarios Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (usuario_id);


--
-- TOC entry 2921 (class 2606 OID 19173)
-- Name: MetodosValidacion Validation_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MetodosValidacion"
    ADD CONSTRAINT "Validation_methods_pkey" PRIMARY KEY (metodo_validacion_id);


--
-- TOC entry 2901 (class 2606 OID 19175)
-- Name: Auditorias audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Auditorias"
    ADD CONSTRAINT audits_pkey PRIMARY KEY (auditoria_id);


--
-- TOC entry 2930 (class 2606 OID 19176)
-- Name: Login Login_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Login"
    ADD CONSTRAINT "Login_role_id_fkey" FOREIGN KEY (rol_id) REFERENCES public."Roles"(rol_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2931 (class 2606 OID 19181)
-- Name: Login Login_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Login"
    ADD CONSTRAINT "Login_user_id_fkey" FOREIGN KEY (usuario_id) REFERENCES public."Usuarios"(usuario_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2933 (class 2606 OID 21477)
-- Name: Menus Menus_parentMenuId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Menus"
    ADD CONSTRAINT "Menus_parentMenuId_fkey" FOREIGN KEY ("parentMenuId") REFERENCES public."Menus"(menu_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2937 (class 2606 OID 19196)
-- Name: DoblesFactores Twofactor_login_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoblesFactores"
    ADD CONSTRAINT "Twofactor_login_id_fkey" FOREIGN KEY (login_id) REFERENCES public."Login"(login_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2939 (class 2606 OID 21452)
-- Name: EmpresasMenus fk_empresa_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmpresasMenus"
    ADD CONSTRAINT fk_empresa_id FOREIGN KEY (empresa_id) REFERENCES public."Empresas"(empresa_id);


--
-- TOC entry 2941 (class 2606 OID 21500)
-- Name: MenuPersonalizado fk_empresa_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenuPersonalizado"
    ADD CONSTRAINT fk_empresa_id FOREIGN KEY (empresa_id) REFERENCES public."Empresas"(empresa_id);


--
-- TOC entry 2934 (class 2606 OID 19268)
-- Name: Permisos fk_entidad_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permisos"
    ADD CONSTRAINT fk_entidad_id FOREIGN KEY (entidad_id) REFERENCES public."Entidades"(entidad_id);


--
-- TOC entry 2932 (class 2606 OID 21400)
-- Name: Menus fk_entidad_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Menus"
    ADD CONSTRAINT fk_entidad_id FOREIGN KEY (entidad_id) REFERENCES public."Entidades"(entidad_id);


--
-- TOC entry 2940 (class 2606 OID 21465)
-- Name: EmpresasMenus fk_menu_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmpresasMenus"
    ADD CONSTRAINT fk_menu_id FOREIGN KEY (menu_id) REFERENCES public."Menus"(menu_id);


--
-- TOC entry 2942 (class 2606 OID 21533)
-- Name: MenusPalabras fk_menu_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenusPalabras"
    ADD CONSTRAINT fk_menu_id FOREIGN KEY (menu_id) REFERENCES public."Menus"(menu_id);


--
-- TOC entry 2936 (class 2606 OID 19300)
-- Name: RolesPermisos fk_permiso_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolesPermisos"
    ADD CONSTRAINT fk_permiso_id FOREIGN KEY (permiso_id) REFERENCES public."Permisos"(permiso_id);


--
-- TOC entry 2935 (class 2606 OID 19295)
-- Name: RolesPermisos fk_rol_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolesPermisos"
    ADD CONSTRAINT fk_rol_id FOREIGN KEY (rol_id) REFERENCES public."Roles"(rol_id);


--
-- TOC entry 2938 (class 2606 OID 19211)
-- Name: DoblesFactores fk_validation_method_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DoblesFactores"
    ADD CONSTRAINT fk_validation_method_id FOREIGN KEY (metodo_validacion_id) REFERENCES public."MetodosValidacion"(metodo_validacion_id);


-- Completed on 2021-06-09 17:00:50

--
-- PostgreSQL database dump complete
--

