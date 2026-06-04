--
-- PostgreSQL database dump
--

\restrict AeQVka5eYxhJ9hWT4eIWWkiDIrZhbL6IPuNxuHwgbVfukUoBbMC6KKU6FzhDXPi

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('38145416-72f8-4636-9eef-a98801b9b56e', 'admin@univ-ndere.cm', NULL, '$2a$12$J1ycYWzS90vEjTBGUApmJuGp8E9CvtwiQuK2SYgtQg2v7dXBp9VSS', 'SUPER_ADMIN', 'Admin', 'Système', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, true, '2026-05-11 10:57:53.231', '2026-05-11 10:57:53.231', NULL, NULL);
INSERT INTO public.users VALUES ('656116fb-db65-4ef0-ac0f-2d0fcca6eab8', 'test@tej.com', NULL, '$2a$12$OTwb6qOyxq0laQmWit6PtOFweZ8ZfiP5D8fN06PLaktLVHfDpvBIq', 'CANDIDAT', 'vins', 'Dupont', NULL, NULL, NULL, NULL, NULL, false, '404409', '2026-05-12 04:34:40.257', true, '2026-05-12 04:19:40.262', '2026-05-12 04:19:40.262', NULL, NULL);
INSERT INTO public.users VALUES ('afab2e77-c09b-4a56-9683-34925a431513', 'komguepvianney@gmail.com', NULL, '$2a$12$gXeVD7OVNXgDTfK/eX5DhuX/g2k08NAvUXzm7Qsrn.Hn/pirvsb8q', 'CANDIDAT', 'vins', 'tpk', NULL, NULL, NULL, NULL, NULL, false, '791714', '2026-05-12 04:35:17.018', true, '2026-05-12 04:20:17.02', '2026-05-15 20:59:37.328', NULL, NULL);
INSERT INTO public.users VALUES ('f5fed2c6-0d42-44e3-9e99-0497b88917ff', 'tpkomguep@gmail.com', '+237655165394', '$2a$12$xd0hZs5y4VVyer.dfPGGoOJIrKRQhmAYFC1LEF05xSIfmy7MqAuqO', 'CANDIDAT', 'michel', 'yvan', NULL, NULL, NULL, NULL, NULL, false, '879979', '2026-05-23 09:36:25.006', true, '2026-05-23 09:21:25.008', '2026-05-23 09:21:25.008', NULL, NULL);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.audit_logs VALUES ('552be223-95e6-4360-ac8e-0596a721c192', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_EN_COURS_EXAMEN', 'Candidature STAB-L1-2026-75476 -> EN_COURS_EXAMEN. ', NULL, '2026-05-12 04:25:30.749');
INSERT INTO public.audit_logs VALUES ('12ba0986-ae99-4596-95eb-d0b38439fd22', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_COMPLEMENT_DEMANDE', 'Candidature STAB-L1-2026-75476 -> COMPLEMENT_DEMANDE. ', NULL, '2026-05-12 04:25:46.841');
INSERT INTO public.audit_logs VALUES ('b1a7d98c-ce85-43c6-9091-ccd894c9606a', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_EN_COURS_EXAMEN', 'Candidature STAB-L1-2026-75476 -> EN_COURS_EXAMEN. ', NULL, '2026-05-14 10:24:21.84');
INSERT INTO public.audit_logs VALUES ('d551630b-aba5-4d59-b190-933e2531eb94', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_VALIDEE', 'Candidature STAB-L1-2026-75476 -> VALIDEE. ', NULL, '2026-05-14 10:24:46.121');
INSERT INTO public.audit_logs VALUES ('26177b9c-2514-4b74-8663-e6751111c602', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_ADMISSIBLE', 'Candidature STAB-L1-2026-75476 -> ADMISSIBLE. ', NULL, '2026-05-14 10:24:55.796');
INSERT INTO public.audit_logs VALUES ('9de2effd-a6ac-4128-8426-85082d5105f1', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_ADMIS', 'Candidature STAB-L1-2026-75476 -> ADMIS. ', NULL, '2026-05-14 10:25:02.908');
INSERT INTO public.audit_logs VALUES ('3d5350f2-1ba7-44d9-a3a0-62c3275db26a', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_ADMIS', 'Candidature BIOMED-MASTER-PRO-2026-89831 -> ADMIS. ', NULL, '2026-05-15 18:26:20.775');
INSERT INTO public.audit_logs VALUES ('b730609a-08c5-44e0-b2ef-6b2fb2394aff', '38145416-72f8-4636-9eef-a98801b9b56e', 'USER_ADMIN_UPDATE', 'Utilisateur komguepvianney@gmail.com mis a jour: {"emailVerified":true}', NULL, '2026-05-15 20:59:23.218');
INSERT INTO public.audit_logs VALUES ('459bfa22-596f-4e7a-bdfe-14cc51215626', '38145416-72f8-4636-9eef-a98801b9b56e', 'USER_ADMIN_UPDATE', 'Utilisateur komguepvianney@gmail.com mis a jour: {"emailVerified":false}', NULL, '2026-05-15 20:59:34.652');
INSERT INTO public.audit_logs VALUES ('d7ea010e-cd5d-4558-939e-e572d0f45acc', '38145416-72f8-4636-9eef-a98801b9b56e', 'USER_ADMIN_UPDATE', 'Utilisateur komguepvianney@gmail.com mis a jour: {"emailVerified":true}', NULL, '2026-05-15 20:59:35.862');
INSERT INTO public.audit_logs VALUES ('39fdcedc-27df-4969-805c-bb5df1eca40f', '38145416-72f8-4636-9eef-a98801b9b56e', 'USER_ADMIN_UPDATE', 'Utilisateur komguepvianney@gmail.com mis a jour: {"emailVerified":false}', NULL, '2026-05-15 20:59:37.342');
INSERT INTO public.audit_logs VALUES ('d767bd55-7489-443f-ba8d-60a4ad86d4ed', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_COMPLEMENT_DEMANDE', 'Candidature IAA-MAF-M1-2026-69223 -> COMPLEMENT_DEMANDE. ', NULL, '2026-05-23 09:43:42.844');
INSERT INTO public.audit_logs VALUES ('292f5e0b-a679-4b2c-9ac0-6f5fe9e51cbd', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_EN_COURS_EXAMEN', 'Candidature IAA-MAF-M1-2026-69223 -> EN_COURS_EXAMEN. ', NULL, '2026-05-23 09:45:56.445');
INSERT INTO public.audit_logs VALUES ('b845f818-9abb-429f-a12c-58910a19517f', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_VALIDEE', 'Candidature IAA-MAF-M1-2026-69223 -> VALIDEE. ', NULL, '2026-05-23 09:46:04.372');
INSERT INTO public.audit_logs VALUES ('0fb33fc6-63b4-45ca-89b9-b96c653a628f', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_COMPLEMENT_DEMANDE', 'Candidature IAA-MAF-M1-2026-16088 -> COMPLEMENT_DEMANDE. ', NULL, '2026-05-23 10:10:14.518');
INSERT INTO public.audit_logs VALUES ('5dafdde9-70a5-48ee-89ca-a3e4e247a1c6', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_COMPLEMENT_DEMANDE', 'Candidature IAA-MAF-M1-2026-16088 -> COMPLEMENT_DEMANDE. ', NULL, '2026-05-23 10:16:03.565');
INSERT INTO public.audit_logs VALUES ('a5641d30-bb28-4a59-9592-17e94fd48784', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_COMPLEMENT_DEMANDE', 'Candidature IAA-MAF-M1-2026-16088 -> COMPLEMENT_DEMANDE. ', NULL, '2026-05-23 10:16:16.69');
INSERT INTO public.audit_logs VALUES ('5f13eb47-a05a-4e36-8386-50e3ac29ce6e', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_EN_COURS_EXAMEN', 'Candidature IAA-MAF-M1-2026-16088 -> EN_COURS_EXAMEN. ', NULL, '2026-05-23 10:16:46.05');
INSERT INTO public.audit_logs VALUES ('bd50d046-93f3-4f5a-8ba7-69bd893a47fe', '38145416-72f8-4636-9eef-a98801b9b56e', 'CANDIDATURE_STATUS_VALIDEE', 'Candidature IAA-MAF-M1-2026-16088 -> VALIDEE. ', NULL, '2026-05-23 10:17:34.296');


--
-- Data for Name: concours; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.concours VALUES ('stab-master-pro', 'STAB_MASTER_PRO', 'Concours STAB Master Professionnel', 'Formulaire de candidature en Master professionnel', 'STAB', 80, 20000.00, 'Etre titulaire d''une Licence compatible avec les sciences et techniques de l''agriculture biologique.', '2026-05-15 08:00:00', '2026-08-30 17:00:00', '2026-09-10 08:00:00', NULL, 'PUBLIE', NULL, true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-15 14:53:33.206', '2026-05-22 19:19:14.217', '{Maroua,Ngaoundere,Yaounde}', '{Horticulture,"Production des semences",Agro-ecologie,Pisciculture,Aviculture,"Production laitiere",Apiculture}', '{"Acte de naissance","Photos d''identite","Certificat medical","Recu de paiement","Licence professionnelle","Releves complets","Demande manuscrite timbree"}');
INSERT INTO public.concours VALUES ('stab-master', 'STAB_MASTER', 'Concours STAB Master', 'Formulaire de candidature en Master', 'STAB', 80, 20000.00, 'Etre titulaire d''une Licence compatible avec les sciences et techniques de l''agriculture biologique.', '2026-05-15 08:00:00', '2026-08-30 17:00:00', '2026-09-10 08:00:00', NULL, 'PUBLIE', NULL, true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-15 14:53:33.203', '2026-05-22 19:19:15.204', '{Maroua,Ngaoundere,Yaounde}', '{Horticulture,"Production des semences",Agro-ecologie,Pisciculture,Aviculture,"Production laitiere",Apiculture}', '{"Acte de naissance","Photos d''identite","Certificat medical","Recu de paiement",Licence,"Releves de notes Licence","Demande manuscrite"}');
INSERT INTO public.concours VALUES ('biomed-l3', 'BIOMED_L3', 'Concours BIOMED Licence 3 professionnelle', 'Candidature en Licence 3 professionnelle biomedicale', 'Sciences biomedicales', 60, 20000.00, 'Etre titulaire d''un diplome Bac+2 compatible avec les sciences biomedicales ou medico-sanitaires.', '2026-05-15 08:00:00', '2026-08-30 17:00:00', '2026-09-10 08:00:00', NULL, 'PUBLIE', NULL, true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-15 14:53:33.211', '2026-05-22 19:19:07.067', '{Ngaoundere,Yaounde,Douala,Garoua,Maroua}', '{"Sciences biomedicales","Sciences medico-sanitaires","Analyses biologiques et medicales","Techniques de laboratoire"}', '{"Copie certifiee conforme de l''acte de naissance","Photo d''identite","Certificat medical","Quitus ou recu de paiement des frais de concours","Carte nationale d''identite ou passeport","Diplome donnant acces a la Licence 3 professionnelle","Releves de notes L1 et L2"}');
INSERT INTO public.concours VALUES ('biomed-l1', 'BIOMED_L1', 'Concours BIOMED Licence 1', 'Candidature en premiere annee des filieres biomedicales et medico-sanitaires', 'Sciences biomedicales', 180, 20000.00, 'Etre titulaire d''un Baccalaureat scientifique, d''un GCE Advanced Level scientifique ou d''un diplome equivalent.', '2026-05-15 08:00:00', '2026-08-30 17:00:00', '2026-09-10 08:00:00', NULL, 'PUBLIE', NULL, true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-15 14:53:33.208', '2026-05-22 19:19:08.313', '{Ngaoundere,Yaounde,Douala,Garoua,Maroua}', '{"Sciences biomedicales","Sciences medico-sanitaires","Soins infirmiers",Kinesitherapie,"Techniques de laboratoire"}', '{"Copie certifiee conforme de l''acte de naissance","Photo d''identite","Certificat medical","Quitus ou recu de paiement des frais de concours","Carte nationale d''identite ou passeport","Baccalaureat ou GCE Advanced Level","Probatoire ou GCE Ordinary Level"}');
INSERT INTO public.concours VALUES ('stab-l3', 'STAB_L3', 'Concours STAB Licence 3 Professionnelle', 'Formulaire de candidature en Licence 3 professionnelle', 'STAB', 100, 15000.00, 'Etre titulaire du Probatoire et du Baccalaureat ou GCE O/L et GCE A/L compatibles avec la specialite choisie.', '2026-05-15 08:00:00', '2026-08-30 17:00:00', '2026-09-10 08:00:00', NULL, 'PUBLIE', NULL, true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-15 14:53:33.201', '2026-05-22 19:19:16.047', '{Maroua,Ngaoundere,Yaounde}', '{Horticulture,"Production des semences",Agro-ecologie,Pisciculture,Aviculture,"Production laitiere",Apiculture}', '{"Acte de naissance","Photos d''identite","Certificat medical","Recu de paiement","Diplome d''acces au concours","Releves de notes L1/L2","Carte nationale d''identite"}');
INSERT INTO public.concours VALUES ('stab-l1', 'STAB_L1', 'Concours STAB Licence 1', 'Production vegetale et production animale', 'STAB', 100, 15000.00, 'Etre titulaire du Probatoire et du Baccalaureat ou GCE O/L et GCE A/L compatibles.', '2026-05-15 08:00:00', '2026-08-30 17:00:00', '2026-09-10 08:00:00', NULL, 'PUBLIE', NULL, true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-15 14:53:33.187', '2026-05-22 19:19:17.551', '{Maroua,Ngaoundere,Yaounde}', '{"Production vegetale","Production animale"}', '{"Acte de naissance","Photos d''identite","Certificat medical","Recu de paiement",Baccalaureat,Probatoire}');
INSERT INTO public.concours VALUES ('biomed-master-pro', 'BIOMED_MASTER_PRO', 'Concours BIOMED Master Professionnel', 'Candidature en Master professionnel biomedical', 'Sciences biomedicales', 40, 25000.00, 'Etre titulaire d''une Licence professionnelle ou d''un diplome equivalent, avec stage ou experience professionnelle appreciee.', '2026-05-15 08:00:00', '2026-08-30 17:00:00', '2026-09-10 08:00:00', NULL, 'PUBLIE', NULL, true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-15 14:53:33.218', '2026-05-15 14:53:33.218', '{Ngaoundere,Yaounde,Douala,Garoua,Maroua}', '{"Sciences biomedicales","Sciences medico-sanitaires","Analyses biologiques et medicales","Techniques de laboratoire"}', '{"Copie certifiee conforme de l''acte de naissance","Photo d''identite","Certificat medical","Quitus ou recu de paiement des frais de concours","Carte nationale d''identite ou passeport","Licence professionnelle ou diplome equivalent","Releves de notes complets","Demande manuscrite timbree","Attestation de stage ou experience professionnelle"}');
INSERT INTO public.concours VALUES ('bb1535c4-2104-492a-9c13-5a25202e66bf', 'BIOMED_L3', 'Concours math info 1', 'Candidature en Licence 3 professionnelle biomedicale', 'Sciences biomedicales', 29, 2000.00, 'ras', '2026-05-05 00:00:00', '2026-10-10 00:00:00', '2027-10-10 00:00:00', '2029-10-10 00:00:00', 'BROUILLON', NULL, true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-22 15:11:11.22', '2026-05-22 15:11:11.22', '{Ngaoundere,Yaounde,Douala,Garoua,Maroua}', '{"Sciences biomedicales","Sciences medico-sanitaires","Analyses biologiques et medicales","Techniques de laboratoire"}', '{"Copie certifiee conforme de l''acte de naissance","Photo d''identite","Certificat medical","Quitus ou recu de paiement des frais de concours","Carte nationale d''identite ou passeport","Diplome donnant acces a la Licence 3 professionnelle","Releves de notes L1 et L2"}');
INSERT INTO public.concours VALUES ('7732f878-7cfd-4f9f-86dc-9f042c3ec3e7', 'BIOMED_L1', 'Concours test2', 'Candidature en premiere annee des filieres biomedicales et medico-sanitaires', 'Sciences biomedicales', 1, 0.00, '123', '2020-02-02 00:00:00', '2020-02-02 00:00:00', '2020-02-02 00:00:00', '2020-02-02 00:00:00', 'BROUILLON', 'http://localhost:3000/admin/concours/new', true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-22 15:18:36.952', '2026-05-22 15:18:36.952', '{Ngaoundere,Yaounde,Douala,Garoua,Maroua}', '{"Sciences biomedicales","Sciences medico-sanitaires","Soins infirmiers",Kinesitherapie,"Techniques de laboratoire"}', '{"Copie certifiee conforme de l''acte de naissance","Photo d''identite","Certificat medical","Quitus ou recu de paiement des frais de concours","Carte nationale d''identite ou passeport","Baccalaureat ou GCE Advanced Level","Probatoire ou GCE Ordinary Level"}');
INSERT INTO public.concours VALUES ('d31e715a-c823-4419-842d-2be14ca78b13', 'BIOMED_L1', 'Concours TEST2', 'Candidature en premiere annee des filieres biomedicales et medico-sanitaires', 'Sciences biomedicales', 16, 2000.00, 'http://localhost:3000/admin/concours/new', '2020-02-02 00:00:00', '2020-02-02 00:00:00', '2020-02-02 00:00:00', '2020-02-02 00:00:00', 'BROUILLON', 'http://localhost:3000/admin/concours/new', true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-22 15:20:23.13', '2026-05-22 15:20:23.13', '{Ngaoundere,Yaounde,Douala,Garoua,Maroua}', '{"Sciences biomedicales","Sciences medico-sanitaires","Soins infirmiers",Kinesitherapie,"Techniques de laboratoire"}', '{"Copie certifiee conforme de l''acte de naissance","Photo d''identite","Certificat medical","Quitus ou recu de paiement des frais de concours","Carte nationale d''identite ou passeport","Baccalaureat ou GCE Advanced Level","Probatoire ou GCE Ordinary Level"}');
INSERT INTO public.concours VALUES ('biomed-master', 'BIOMED_MASTER', 'Concours BIOMED Master 1', 'Candidature en Master 1 sciences biomedicales', 'Sciences biomedicales', 50, 25000.00, 'Etre titulaire d''une Licence compatible avec les sciences biomedicales ou medico-sanitaires.', '2026-05-15 08:00:00', '2026-08-30 17:00:00', '2026-09-10 08:00:00', NULL, 'PUBLIE', NULL, true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-15 14:53:33.214', '2026-05-22 19:19:09.814', '{Ngaoundere,Yaounde,Douala,Garoua,Maroua}', '{"Sciences biomedicales","Sciences medico-sanitaires","Analyses biologiques et medicales","Techniques de laboratoire"}', '{"Copie certifiee conforme de l''acte de naissance","Photo d''identite","Certificat medical","Quitus ou recu de paiement des frais de concours","Carte nationale d''identite ou passeport","Licence ou diplome equivalent","Releves de notes du cycle Licence","Demande manuscrite"}');
INSERT INTO public.concours VALUES ('c08931db-71c8-4ddc-ba8f-0a950bdad6fe', 'STAB_L1', 'Concours test', 'Production vegetale et production animale', 'STAB', 36, 2000.00, 'yo', '2026-02-02 00:00:00', '2026-02-02 00:00:00', '2026-02-02 00:00:00', '2027-01-01 00:00:00', 'PUBLIE', 'http://localhost:3000/admin/concours/new', true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-22 15:15:08.208', '2026-05-22 19:19:21.778', '{Maroua,Ngaoundere,Yaounde}', '{"Production vegetale","Production animale"}', '{"Acte de naissance","Photos d''identite","Certificat medical","Recu de paiement",Baccalaureat,Probatoire}');
INSERT INTO public.concours VALUES ('iaa-maf-m1-2026', 'IAA_MAF_M1', 'Concours IAA-MAF Master professionnel 1', 'Premiere annee du Master professionnel en Intelligence artificielle appliquee et Mathematiques financieres.', 'IAA-MAF', 40, 20000.00, 'Etre titulaire d''une Licence scientifique ou professionnelle en informatique, informatique industrielle, technologies de l''information, mathematiques, mathematiques appliquees, physique electronique, econometrie, d''un diplome d''ingenieur ou de tout diplome reconnu equivalent par le Ministere de l''Enseignement Superieur.', '2026-04-17 08:00:00', '2026-09-30 17:00:00', NULL, NULL, 'PUBLIE', '/docs/Concours_IAA-MAF-2026.pdf', true, '38145416-72f8-4636-9eef-a98801b9b56e', '2026-05-23 09:05:08.983', '2026-05-23 09:05:08.983', '{Ngaoundere,"Yaounde (Nkolbisson)",Maroua}', '{"Applied Artificial Intelligence","Financial Mathematics"}', '{"Demande manuscrite timbree","Formulaire de candidature dument rempli","Copie certifiee conforme de l''acte de naissance","Copie certifiee conforme du diplome requis ou equivalent","Copie certifiee conforme de la carte nationale d''identite ou du passeport","Certificat medical delivre par le CMS de l''Universite de Ngaoundere ou par un medecin de l''administration","Releves de notes du ou des niveaux du cycle Licence professionnelle","Recu de paiement des frais d''etude du dossier de 20 000 FCFA","Deux enveloppes format 28 x 37 timbrees a l''adresse du candidat"}');


--
-- Data for Name: candidatures; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.candidatures VALUES ('cmp758l5s000114g1p5achcbb', 'BIOMED_MASTER_PRO', 'Sciences biomedicales', 'Ngaoundere', '{"nom": "yvan", "genre": "Masculin", "centre": "Ngaoundere", "prenom": "michel", "filiere": "Sciences biomedicales", "academic": {"mention": "bien", "etablissement": "univ", "anneeObtention": "2023", "licenceProfessionnelle": "lipro", "experienceProfessionnelle": "RAS"}, "telephone": "655165394", "nationalite": "Camerounaise", "concoursType": "BIOMED_MASTER_PRO", "dateNaissance": "2026-05-07", "lieuNaissance": "Ngaoundéré", "regionOrigine": "ouest", "signatureAgent": "yieuhhhhh", "signatureCandidat": "tpk la révo", "departementOrigine": "koungh-ki"}', 'ADMIS', NULL, '2026-05-15 16:40:30.493', '2026-05-15 18:26:01.872', '2026-05-15 16:40:30.495', '2026-05-15 18:26:18.745', 'afab2e77-c09b-4a56-9683-34925a431513', 'biomed-master-pro', NULL, 2023, NULL, NULL, '2026-05-07 00:00:00', 'lipro', 'univ', 1, 'Ngaoundéré', 'bien', NULL, 'Camerounaise', 'yvan', 'BIOMED-MASTER-PRO-2026-89831', 'BIOMED-MASTER-PRO-2026-89831', 'michel', 'Masculin', NULL, '655165394', NULL);
INSERT INTO public.candidatures VALUES ('cmpi5tnqa000110fwy3f6u0is', 'IAA_MAF_M1', 'Applied Artificial Intelligence', 'Ngaoundere', '{"nom": "yvan", "genre": "Féminin", "centre": "Ngaoundere", "prenom": "michel", "filiere": "Applied Artificial Intelligence", "academic": {"licence": "knl", "mention": "bien", "etablissement": "hljih", "anneeObtention": "2020"}, "telephone": "+237655165394", "nationalite": "Camerounaise", "concoursType": "IAA_MAF_M1", "dateNaissance": "2026-05-07", "lieuNaissance": "Ngaoundéré", "regionOrigine": "ouest", "signatureAgent": "yieuhhhhh", "signatureCandidat": "tpk la révo", "departementOrigine": "koungh-ki"}', 'VALIDEE', 'Complément fourni par le candidat le 23/05/2026.', '2026-05-23 09:44:52.442', '2026-05-23 09:46:00.03', '2026-05-23 09:42:21.538', '2026-05-23 09:46:00.036', '656116fb-db65-4ef0-ac0f-2d0fcca6eab8', 'iaa-maf-m1-2026', NULL, 2020, NULL, NULL, '2026-05-07 00:00:00', 'knl', 'hljih', 1, 'Ngaoundéré', 'bien', NULL, 'Camerounaise', 'yvan', 'IAA-MAF-M1-2026-69223', 'IAA-MAF-M1-2026-69223', 'michel', 'Féminin', '2026-05-23 09:44:52.442', '+237655165394', NULL);
INSERT INTO public.candidatures VALUES ('cmpi5zp8w000410fwr68hk62m', 'IAA_MAF_M1', 'Applied Artificial Intelligence', 'Yaounde (Nkolbisson)', '{"nom": "yvan", "genre": "Féminin", "centre": "Yaounde (Nkolbisson)", "prenom": "michel", "filiere": "Applied Artificial Intelligence", "academic": {"licence": "knl", "mention": "bien", "etablissement": "hljih", "anneeObtention": "2020"}, "telephone": "+237655165394", "nationalite": "Camerounaise", "concoursType": "IAA_MAF_M1", "dateNaissance": "2026-05-07", "lieuNaissance": "Ngaoundéré", "regionOrigine": "ouest", "signatureAgent": "yieuhhhhh", "signatureCandidat": "tpk la révo", "departementOrigine": "koungh-ki"}', 'VALIDEE', 'Complément fourni par le candidat le 23/05/2026.', '2026-05-23 10:11:56.677', '2026-05-23 10:17:29.686', '2026-05-23 09:47:03.441', '2026-05-23 10:17:29.688', 'afab2e77-c09b-4a56-9683-34925a431513', 'iaa-maf-m1-2026', NULL, 2020, NULL, NULL, '2026-05-07 00:00:00', 'knl', 'hljih', 1, 'Ngaoundéré', 'bien', NULL, 'Camerounaise', 'yvan', 'IAA-MAF-M1-2026-16088', 'IAA-MAF-M1-2026-16088', 'michel', 'Féminin', '2026-05-23 10:11:56.677', '+237655165394', NULL);
INSERT INTO public.candidatures VALUES ('cmpi7gjb30001x8owd6i9my6r', 'STAB_MASTER', 'Horticulture', 'Yaounde', '{"nom": "yvan", "genre": "Féminin", "centre": "Yaounde", "prenom": "michel", "filiere": "Horticulture", "academic": {"anneeBac": "2020", "mentionBac": "ghn,;", "anneeLicence": "2023", "mentionLicence": "knl"}, "telephone": "+237655165394", "nationalite": "Camerounaise", "concoursType": "STAB_MASTER", "dateNaissance": "2026-05-13", "lieuNaissance": "Ngaoundéré", "regionOrigine": "ouest", "signatureAgent": "yieuhhhhh", "signatureCandidat": "tpk la révo", "departementOrigine": "koungh-ki"}', 'SOUMISE', NULL, '2026-05-23 10:28:08.508', NULL, '2026-05-23 10:28:08.51', '2026-05-23 10:28:08.51', 'afab2e77-c09b-4a56-9683-34925a431513', 'stab-master', NULL, NULL, NULL, NULL, '2026-05-13 00:00:00', '2020', NULL, 1, 'Ngaoundéré', 'ghn,;', NULL, 'Camerounaise', 'yvan', 'STAB-MASTER-2026-52051', 'STAB-MASTER-2026-52051', 'michel', 'Féminin', NULL, '+237655165394', NULL);


--
-- Data for Name: candidature_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: concours_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.concours_documents VALUES ('eaf6e050-20e2-4bbb-8565-326bcd1cc1b4', 'stab-l1', 'Acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('96cb001d-22b3-424f-a146-e5208232e9f1', 'stab-l1', 'Photos d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('0ab6afa0-04b4-4c6d-9ad5-e07265c8be9d', 'stab-l1', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('bcb5beed-389b-41c3-803a-119935da4af0', 'stab-l1', 'Recu de paiement', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('ed5e06fe-26eb-4b2f-8a0a-a1a27fbbd945', 'stab-l1', 'Baccalaureat', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('d6d3604e-10bd-4309-ab71-05178b032468', 'stab-l1', 'Probatoire', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('98d66274-8a87-48fe-bb5a-0ded03d34e2e', 'stab-l3', 'Acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('2c5ade72-3685-443d-a0b8-19f1a68d33a2', 'stab-l3', 'Photos d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('78a889c6-7ff9-4d5c-9fdf-007d07b42f94', 'stab-l3', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('a454a2ef-03e3-48f1-9e6c-914a81174098', 'stab-l3', 'Recu de paiement', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('23748261-9946-4cda-89d5-5b2450f89d7e', 'stab-l3', 'Diplome d''acces au concours', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('bfa6c42e-517d-41c1-a55d-7ea4a5469f07', 'stab-l3', 'Releves de notes L1/L2', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('c71bdc70-874a-4ea4-bddc-d3da8b6e7f79', 'stab-l3', 'Carte nationale d''identite', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('8ef08f3e-0043-4266-8b02-32c78bb06a53', 'stab-master', 'Acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('d420bdaa-d45d-49a7-b50b-d171fbeabcef', 'stab-master', 'Photos d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('d3c198f9-c726-4cc2-b876-3c0b63880094', 'stab-master', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('7eea2953-d67c-4fbe-977f-71374d1e3936', 'stab-master', 'Recu de paiement', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('5a6149bb-15fb-4cb9-ade6-1fc35a1c6643', 'stab-master', 'Licence', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('81bc6640-743c-4df8-92e9-e7a86171ad87', 'stab-master', 'Releves de notes Licence', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('88027eac-6960-4abd-ba54-4324ff94f882', 'stab-master', 'Demande manuscrite', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('87023e8c-8805-4bd2-8172-4a05bc4d0709', 'stab-master-pro', 'Acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('f49f7a35-7116-4130-aa65-463c68918cfa', 'stab-master-pro', 'Photos d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('81a16e5b-d88b-4c97-ac61-b321528e0f90', 'stab-master-pro', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('9279bf42-ae0c-46be-a310-f9dc50d9fedc', 'stab-master-pro', 'Recu de paiement', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('fe3ee362-319a-4964-ba1e-c748128da067', 'stab-master-pro', 'Licence professionnelle', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('4a5268a6-4acf-4d21-8c3f-8d7d6502116d', 'stab-master-pro', 'Releves complets', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('ed58146a-2e51-475b-9d3d-26ec86c37b0a', 'stab-master-pro', 'Demande manuscrite timbree', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('dda89e2c-c87a-4b72-8fce-7dbeae867573', 'biomed-l1', 'Copie certifiee conforme de l''acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('1bcbc6ff-26db-4b34-9741-3b10769950cf', 'biomed-l1', 'Photo d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('88519b07-5ff2-416a-9fd6-bdea50713361', 'biomed-l1', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('07b9c15c-3eb9-4b43-a335-914a94ba2c07', 'biomed-l1', 'Quitus ou recu de paiement des frais de concours', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('7b261205-0d50-4602-aada-4dbac2b9dfb2', 'biomed-l1', 'Carte nationale d''identite ou passeport', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('5b355641-d667-4cdd-a05f-d24c730d9f09', 'biomed-l1', 'Baccalaureat ou GCE Advanced Level', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('91af10e9-a7d5-441f-b352-22ec0d949a24', 'biomed-l1', 'Probatoire ou GCE Ordinary Level', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('b7442448-7994-49cd-b60c-3288c190accc', 'biomed-l3', 'Copie certifiee conforme de l''acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('422b85c7-cdc2-49af-8466-555cd458723b', 'biomed-l3', 'Photo d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('66173f0c-1160-423e-9fea-4454cbc38013', 'biomed-l3', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('c0991006-20ff-4f61-b880-d58ce57d83d3', 'biomed-l3', 'Quitus ou recu de paiement des frais de concours', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('b25475bd-a5e5-4e46-b19a-ecac2a79a41e', 'biomed-l3', 'Carte nationale d''identite ou passeport', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('3951dd35-eee4-4e54-9cf5-0f953a8800f4', 'biomed-l3', 'Diplome donnant acces a la Licence 3 professionnelle', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('30450a5c-ada8-40a7-abf6-a718575b8669', 'biomed-l3', 'Releves de notes L1 et L2', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('d9bc25f1-89f2-4bca-a06d-d28230ca619c', 'biomed-master', 'Copie certifiee conforme de l''acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('5f7a9a43-2cbf-46a0-a0fe-26025cef2814', 'biomed-master', 'Photo d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('eaae28b8-6952-4c92-ad35-3d03aad5b984', 'biomed-master', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('092f134b-4e86-41de-be11-49da31939342', 'biomed-master', 'Quitus ou recu de paiement des frais de concours', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('d94f5d19-b336-483e-8fd6-cdae7c49598d', 'biomed-master', 'Carte nationale d''identite ou passeport', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('8983ae3d-4022-48d4-ac5c-2137bd2f0ce3', 'biomed-master', 'Licence ou diplome equivalent', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('2c10058a-84cc-41c9-834a-3678eef97a07', 'biomed-master', 'Releves de notes du cycle Licence', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('e72eb37d-7a10-4daa-9997-17d284097598', 'biomed-master', 'Demande manuscrite', NULL, true, 5242880, '{}', 7);
INSERT INTO public.concours_documents VALUES ('b1d0752f-af50-4b11-9510-045c6e930e1f', 'biomed-master-pro', 'Copie certifiee conforme de l''acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('5c976787-7591-465b-b54d-2b41e65ccfc0', 'biomed-master-pro', 'Photo d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('3c457a9c-761c-4315-9140-c801542cc35e', 'biomed-master-pro', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('62002ad6-be3a-4975-976a-68114281dccf', 'biomed-master-pro', 'Quitus ou recu de paiement des frais de concours', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('55840553-d585-4226-aca6-7ae5d5fe5c60', 'biomed-master-pro', 'Carte nationale d''identite ou passeport', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('bc4a82b0-929a-42b6-86c7-2a9b56b4953a', 'biomed-master-pro', 'Licence professionnelle ou diplome equivalent', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('c41b2f6a-2e17-4f95-b038-6d2cbf183396', 'biomed-master-pro', 'Releves de notes complets', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('c85f3adf-0827-4ed6-af62-6d4145b50112', 'biomed-master-pro', 'Demande manuscrite timbree', NULL, true, 5242880, '{}', 7);
INSERT INTO public.concours_documents VALUES ('7396b247-c4d4-4120-8596-1f6b495bb2b3', 'biomed-master-pro', 'Attestation de stage ou experience professionnelle', NULL, false, 5242880, '{}', 8);
INSERT INTO public.concours_documents VALUES ('d89089bc-1e0d-4daf-bf8a-0574ac99ef50', 'bb1535c4-2104-492a-9c13-5a25202e66bf', 'Copie certifiee conforme de l''acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('6353fef7-1317-4c86-94d7-f902c5ada452', 'bb1535c4-2104-492a-9c13-5a25202e66bf', 'Photo d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('5a5f7d90-4049-4d38-9bee-66a1697323de', 'bb1535c4-2104-492a-9c13-5a25202e66bf', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('b113307e-6873-41fb-ba36-e0e0c6ca8ab5', 'bb1535c4-2104-492a-9c13-5a25202e66bf', 'Quitus ou recu de paiement des frais de concours', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('410a15cd-9a94-4ac1-b952-6be4dfb398d5', 'bb1535c4-2104-492a-9c13-5a25202e66bf', 'Carte nationale d''identite ou passeport', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('f6a74094-b1d2-4ae8-8c44-f0aa728b5e96', 'bb1535c4-2104-492a-9c13-5a25202e66bf', 'Diplome donnant acces a la Licence 3 professionnelle', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('ddc8f152-340d-4587-b9e9-4ce517df28be', 'bb1535c4-2104-492a-9c13-5a25202e66bf', 'Releves de notes L1 et L2', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('525e52a1-a415-4861-9dbf-7b6d311f11fa', 'c08931db-71c8-4ddc-ba8f-0a950bdad6fe', 'Acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('e2c45615-da2f-48b4-8951-e3a66f4ed636', 'c08931db-71c8-4ddc-ba8f-0a950bdad6fe', 'Photos d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('16a36f63-5b43-4626-b553-14e856161743', 'c08931db-71c8-4ddc-ba8f-0a950bdad6fe', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('ab2adbc9-a3b3-48e0-bce1-7b5871abc858', 'c08931db-71c8-4ddc-ba8f-0a950bdad6fe', 'Recu de paiement', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('ab4c6024-faae-438f-b2ea-5fc227149f95', 'c08931db-71c8-4ddc-ba8f-0a950bdad6fe', 'Baccalaureat', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('6dbeb017-0d84-4ae9-94bd-f464c69c9277', 'c08931db-71c8-4ddc-ba8f-0a950bdad6fe', 'Probatoire', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('e7ca2925-269f-4a15-99f6-8e0dc78d123d', '7732f878-7cfd-4f9f-86dc-9f042c3ec3e7', 'Copie certifiee conforme de l''acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('4b1c6bc8-6930-4f5a-a044-63332df75c03', '7732f878-7cfd-4f9f-86dc-9f042c3ec3e7', 'Photo d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('b2faf291-e58f-44a4-8312-1a8d8103005e', '7732f878-7cfd-4f9f-86dc-9f042c3ec3e7', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('fa0892eb-abdb-4f02-a589-6ef43a4d4aa5', '7732f878-7cfd-4f9f-86dc-9f042c3ec3e7', 'Quitus ou recu de paiement des frais de concours', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('007dc81d-d9e2-4c6d-a714-070704d0939f', '7732f878-7cfd-4f9f-86dc-9f042c3ec3e7', 'Carte nationale d''identite ou passeport', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('5e93a68a-dbc2-4557-b205-341138f86a1d', '7732f878-7cfd-4f9f-86dc-9f042c3ec3e7', 'Baccalaureat ou GCE Advanced Level', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('95e24a3b-c2fa-41ba-aeb6-ac9053dedd3f', '7732f878-7cfd-4f9f-86dc-9f042c3ec3e7', 'Probatoire ou GCE Ordinary Level', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('3bd4374b-6f1a-44e7-a0a8-94b6e68a2541', 'd31e715a-c823-4419-842d-2be14ca78b13', 'Copie certifiee conforme de l''acte de naissance', NULL, true, 5242880, '{}', 0);
INSERT INTO public.concours_documents VALUES ('bdc4164e-b5d5-4507-868e-2253b8bcbcb3', 'd31e715a-c823-4419-842d-2be14ca78b13', 'Photo d''identite', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('27a1c1a5-1318-4675-a5a7-e32fbd055e75', 'd31e715a-c823-4419-842d-2be14ca78b13', 'Certificat medical', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('e520a29a-42a0-41f3-8604-73f81a5a0639', 'd31e715a-c823-4419-842d-2be14ca78b13', 'Quitus ou recu de paiement des frais de concours', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('c436867c-9207-4c39-ba8c-67b31c585333', 'd31e715a-c823-4419-842d-2be14ca78b13', 'Carte nationale d''identite ou passeport', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('8729e8a5-44a6-40d1-8243-7d20dc91ce82', 'd31e715a-c823-4419-842d-2be14ca78b13', 'Baccalaureat ou GCE Advanced Level', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('085cc754-25bb-4a4c-b575-c3cc55f71756', 'd31e715a-c823-4419-842d-2be14ca78b13', 'Probatoire ou GCE Ordinary Level', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('8ebc4f1c-9582-40fb-83ae-ca176be1bb83', 'iaa-maf-m1-2026', 'Demande manuscrite timbree', NULL, true, 5242880, '{}', 1);
INSERT INTO public.concours_documents VALUES ('738fe514-4fa6-4030-aa7f-57f70441407f', 'iaa-maf-m1-2026', 'Formulaire de candidature dument rempli', NULL, true, 5242880, '{}', 2);
INSERT INTO public.concours_documents VALUES ('037e356e-706a-43d5-bff0-e171c998b552', 'iaa-maf-m1-2026', 'Copie certifiee conforme de l''acte de naissance', NULL, true, 5242880, '{}', 3);
INSERT INTO public.concours_documents VALUES ('c5d78b98-7acf-45d9-8136-661dee23ea84', 'iaa-maf-m1-2026', 'Copie certifiee conforme du diplome requis ou equivalent', NULL, true, 5242880, '{}', 4);
INSERT INTO public.concours_documents VALUES ('47c34950-dd71-4893-a0fa-c3a19fb252f4', 'iaa-maf-m1-2026', 'Copie certifiee conforme de la carte nationale d''identite ou du passeport', NULL, true, 5242880, '{}', 5);
INSERT INTO public.concours_documents VALUES ('ad29345c-571b-466e-8e7c-931886ec3b03', 'iaa-maf-m1-2026', 'Certificat medical delivre par le CMS de l''Universite de Ngaoundere ou par un medecin de l''administration', NULL, true, 5242880, '{}', 6);
INSERT INTO public.concours_documents VALUES ('aa615009-bae0-4a17-83c5-bc5fa8c66c3b', 'iaa-maf-m1-2026', 'Releves de notes du ou des niveaux du cycle Licence professionnelle', NULL, true, 5242880, '{}', 7);
INSERT INTO public.concours_documents VALUES ('8cca845a-211a-4d18-8f87-0eb0a8ab8ded', 'iaa-maf-m1-2026', 'Recu de paiement des frais d''etude du dossier de 20 000 FCFA', NULL, true, 5242880, '{}', 8);
INSERT INTO public.concours_documents VALUES ('c20652b1-6f29-4060-a9bd-b414d9830e09', 'iaa-maf-m1-2026', 'Deux enveloppes format 28 x 37 timbrees a l''adresse du candidat', NULL, true, 5242880, '{}', 9);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.messages VALUES ('cb0a1b33-5067-4527-917a-fe3a581f7c12', 'cmpi5tnqa000110fwy3f6u0is', '656116fb-db65-4ef0-ac0f-2d0fcca6eab8', 'CANDIDAT', 'Réponse au complément demandé : ffdfdfdgsdc', false, '2026-05-23 09:44:52.443');
INSERT INTO public.messages VALUES ('05f8becf-b189-4147-bae4-8b4418e04e9d', 'cmpi5zp8w000410fwr68hk62m', 'afab2e77-c09b-4a56-9683-34925a431513', 'CANDIDAT', 'bonjour mosieurs', false, '2026-05-23 10:09:32.103');
INSERT INTO public.messages VALUES ('a5a7be4b-e1eb-4941-9c21-4c47c4a01621', 'cmpi5zp8w000410fwr68hk62m', '38145416-72f8-4636-9eef-a98801b9b56e', 'SUPER_ADMIN', 'ok bien recu', false, '2026-05-23 10:09:56.864');
INSERT INTO public.messages VALUES ('23c7e022-9f80-48e2-941e-f259ba0671d2', 'cmpi5zp8w000410fwr68hk62m', 'afab2e77-c09b-4a56-9683-34925a431513', 'CANDIDAT', 'Réponse au complément demandé : yo bro', false, '2026-05-23 10:11:56.68');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notifications VALUES ('03f36981-86df-4584-9351-97263085a51b', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature En cours d''examen', 'Le statut de votre candidature au concours "Concours STAB Licence 1" a été mis à jour.', true, '2026-05-12 04:25:30.745');
INSERT INTO public.notifications VALUES ('acb34fab-2c98-4840-81e8-fc208f875a05', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature Complément demandé', 'Le statut de votre candidature au concours "Concours STAB Licence 1" a été mis à jour.', true, '2026-05-12 04:25:46.839');
INSERT INTO public.notifications VALUES ('90b63d24-fb85-42fa-b0da-32b9cf8cf971', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature En cours d''examen', 'Le statut de votre candidature au concours "Concours STAB Licence 1" a été mis à jour.', true, '2026-05-14 10:24:21.835');
INSERT INTO public.notifications VALUES ('ae532789-7942-410c-b584-ebab95565c21', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature Validée', 'Le statut de votre candidature au concours "Concours STAB Licence 1" a été mis à jour.', true, '2026-05-14 10:24:46.116');
INSERT INTO public.notifications VALUES ('856c7c5d-5ea3-4411-917e-57feeb3e39c3', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature Admissible', 'Le statut de votre candidature au concours "Concours STAB Licence 1" a été mis à jour.', true, '2026-05-14 10:24:55.783');
INSERT INTO public.notifications VALUES ('59652684-2aab-4ea9-af16-8c4e0b6fbd9d', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature Admis', 'Le statut de votre candidature au concours "Concours STAB Licence 1" a été mis à jour.', true, '2026-05-14 10:25:02.892');
INSERT INTO public.notifications VALUES ('56402b56-0313-4dfb-b8e8-c453b6a06e35', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature Admis', 'Le statut de votre candidature au concours "Concours BIOMED Master Professionnel" a été mis à jour.', true, '2026-05-15 18:26:20.757');
INSERT INTO public.notifications VALUES ('962971c5-cb57-468d-a3e4-16ec5ea5087a', '38145416-72f8-4636-9eef-a98801b9b56e', 'COMPLEMENT_RECU', 'Complément reçu', 'Le candidat vins tpk a répondu au complément demandé pour Concours STAB Licence 1.', true, '2026-05-14 10:22:44.364');
INSERT INTO public.notifications VALUES ('89bf1589-bccd-4fff-8bed-c501ae4c86c3', '656116fb-db65-4ef0-ac0f-2d0fcca6eab8', 'STATUS_CHANGE', 'Candidature Complément demandé', 'Le statut de votre candidature au concours "Concours IAA-MAF Master professionnel 1" a ete mis a jour. Complement demande : vins ce nest pas bon', true, '2026-05-23 09:43:38.207');
INSERT INTO public.notifications VALUES ('765c234b-0fbc-4b3f-9796-16c00feb97ce', '38145416-72f8-4636-9eef-a98801b9b56e', 'COMPLEMENT_RECU', 'Complément reçu', 'Le candidat vins Dupont a répondu au complément demandé pour Concours IAA-MAF Master professionnel 1.', true, '2026-05-23 09:44:52.443');
INSERT INTO public.notifications VALUES ('97ec212b-1405-4cbd-a3a0-a29cd6a7141e', '656116fb-db65-4ef0-ac0f-2d0fcca6eab8', 'STATUS_CHANGE', 'Candidature En cours d''examen', 'Le statut de votre candidature au concours "Concours IAA-MAF Master professionnel 1" a ete mis a jour.', false, '2026-05-23 09:45:51.351');
INSERT INTO public.notifications VALUES ('bb5a6bba-108c-429e-8bcc-97cdc5297123', '656116fb-db65-4ef0-ac0f-2d0fcca6eab8', 'STATUS_CHANGE', 'Candidature Validée', 'Le statut de votre candidature au concours "Concours IAA-MAF Master professionnel 1" a ete mis a jour.', false, '2026-05-23 09:46:00.039');
INSERT INTO public.notifications VALUES ('29200beb-813e-4a5f-9785-27e6534783c2', 'afab2e77-c09b-4a56-9683-34925a431513', 'MESSAGE_ADMIN', 'Nouveau message admin', 'Admin Système a ajoute un message au dossier IAA-MAF-M1-2026-16088.', true, '2026-05-23 10:09:56.869');
INSERT INTO public.notifications VALUES ('15076868-f501-414a-87fa-fc29ace19350', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature Complément demandé', 'Le statut de votre candidature au concours "Concours IAA-MAF Master professionnel 1" a ete mis a jour. Complement demande : demande', true, '2026-05-23 10:10:09.92');
INSERT INTO public.notifications VALUES ('64579a6b-49cf-4e45-b447-b599df6f6381', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature Complément demandé', 'Le statut de votre candidature au concours "Concours IAA-MAF Master professionnel 1" a ete mis a jour. Complement demande : non', true, '2026-05-23 10:15:58.654');
INSERT INTO public.notifications VALUES ('b595a8c0-d149-47ef-b7fa-b7678e748f65', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature Complément demandé', 'Le statut de votre candidature au concours "Concours IAA-MAF Master professionnel 1" a ete mis a jour. Complement demande : non', true, '2026-05-23 10:16:10.159');
INSERT INTO public.notifications VALUES ('b0c812b3-8ef6-44a2-8b4a-30c0b33b05dc', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature En cours d''examen', 'Le statut de votre candidature au concours "Concours IAA-MAF Master professionnel 1" a ete mis a jour. Complement demande : non', true, '2026-05-23 10:16:41.389');
INSERT INTO public.notifications VALUES ('d5fba17c-7eb1-4622-b84b-d82125d3e687', 'afab2e77-c09b-4a56-9683-34925a431513', 'STATUS_CHANGE', 'Candidature Validée', 'Le statut de votre candidature au concours "Concours IAA-MAF Master professionnel 1" a ete mis a jour. Complement demande : non', true, '2026-05-23 10:17:29.705');
INSERT INTO public.notifications VALUES ('2d6715b9-7677-4dad-b3d8-dd1100e54a3b', '38145416-72f8-4636-9eef-a98801b9b56e', 'MESSAGE_CANDIDAT', 'Nouveau message candidat', 'vins tpk a ajoute un message au dossier IAA-MAF-M1-2026-16088.', true, '2026-05-23 10:09:32.122');
INSERT INTO public.notifications VALUES ('75e6b969-1788-4bf3-a1fb-d239ac8a9136', '38145416-72f8-4636-9eef-a98801b9b56e', 'COMPLEMENT_RECU', 'Complément reçu', 'Le candidat vins tpk a répondu au complément demandé pour Concours IAA-MAF Master professionnel 1.', true, '2026-05-23 10:11:56.68');


--
-- Data for Name: paiements; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: resultats; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: uploaded_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000214g1jhb88ihw', 'cmp758l5s000114g1p5achcbb', 'photo', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/a2167876-d454-44fb-84e0-04d31ce2a15c.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000314g1k3f9d5ve', 'cmp758l5s000114g1p5achcbb', 'copie_certifiee_conforme_de_l_acte_de_naissance', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/0fbd397e-8e74-4738-ae62-d38183f99b2e.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000414g1frq8fzfr', 'cmp758l5s000114g1p5achcbb', 'photo_d_identite', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/eb117370-0e95-486c-b776-a31d4c006294.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000514g1xji3mhce', 'cmp758l5s000114g1p5achcbb', 'certificat_medical', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/9d00ea27-41d1-4667-ba62-0011a4af9061.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000614g10upwyej1', 'cmp758l5s000114g1p5achcbb', 'quitus_ou_recu_de_paiement_des_frais_de_concours', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/ac846fe4-4198-4ff7-b597-99fad3411cd1.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000714g1k4sw2oha', 'cmp758l5s000114g1p5achcbb', 'carte_nationale_d_identite_ou_passeport', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/57319db7-6066-4594-8d80-4e83ca2b0c6a.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000814g1sstxm3kc', 'cmp758l5s000114g1p5achcbb', 'licence_professionnelle_ou_diplome_equivalent', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/6237438a-232d-4d33-90bd-e5f7071e15fb.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000914g1fpgrkemc', 'cmp758l5s000114g1p5achcbb', 'releves_de_notes_complets', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/e2bdcefc-1e5f-4c5e-88ca-7ed0aae48ea7.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000a14g1i0fofkfb', 'cmp758l5s000114g1p5achcbb', 'demande_manuscrite_timbree', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/005b6fac-21ce-4071-b1af-c8ef14bc7108.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmp758l6e000b14g1l7z1pyt9', 'cmp758l5s000114g1p5achcbb', 'attestation_de_stage_ou_experience_professionnelle', '/uploads/candidatures/cmp758l5s000114g1p5achcbb/ef472ac3-a7c3-4aaf-8989-1078a7aa6611.png', false, '2026-05-15 16:40:30.518');
INSERT INTO public.uploaded_documents VALUES ('cmpi5ww63000210fwsz8e5xc2', 'cmpi5tnqa000110fwy3f6u0is', 'complement', '/uploads/candidatures/cmpi5tnqa000110fwy3f6u0is/e7af9dee-8fa9-4f91-b71b-04b0e41e865b.jpg', false, '2026-05-23 09:44:52.443');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000610fwy2bpyssf', 'cmpi5zp8w000410fwr68hk62m', 'demande_manuscrite_timbree', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/77bf6efc-db01-408a-a529-da9e30d3b34f.jpg', false, '2026-05-23 09:47:03.479');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000710fwjiuqzagu', 'cmpi5zp8w000410fwr68hk62m', 'formulaire_de_candidature_dument_rempli', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/43c0dfa4-dabe-4f4e-9b64-e3b41f91b02d.jpg', false, '2026-05-23 09:47:03.479');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000810fws13olfmk', 'cmpi5zp8w000410fwr68hk62m', 'copie_certifiee_conforme_de_l_acte_de_naissance', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/b47dc49d-6c15-4b7d-88a2-9df56e5c3229.pdf', false, '2026-05-23 09:47:03.479');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000910fwf6sz6n3i', 'cmpi5zp8w000410fwr68hk62m', 'copie_certifiee_conforme_de_la_carte_nationale_d_identite_ou_du_passeport', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/171ee9d7-27cd-4224-945d-751f2c2818dd.pdf', false, '2026-05-23 09:47:03.479');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000a10fwj9vu8t22', 'cmpi5zp8w000410fwr68hk62m', 'certificat_medical_delivre_par_le_cms_de_l_universite_de_ngaoundere_ou_par_un_medecin_de_l_administration', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/4b7c85cd-7564-4b7b-9586-f340c0b9ec2b.png', false, '2026-05-23 09:47:03.479');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000b10fwrmraw146', 'cmpi5zp8w000410fwr68hk62m', 'releves_de_notes_du_ou_des_niveaux_du_cycle_licence_professionnelle', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/a940d181-f727-4dd3-98b7-5aed5e1a90eb.png', false, '2026-05-23 09:47:03.479');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000c10fwo3k6eneh', 'cmpi5zp8w000410fwr68hk62m', 'recu_de_paiement_des_frais_d_etude_du_dossier_de_20_000_fcfa', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/2c0f9b71-ca8c-48c1-bea2-facc8bffa535.pdf', false, '2026-05-23 09:47:03.479');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000d10fwb96vxkek', 'cmpi5zp8w000410fwr68hk62m', 'deux_enveloppes_format_28_x_37_timbrees_a_l_adresse_du_candidat', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/25685d8f-17ac-444c-b164-ed7e69f766d5.png', false, '2026-05-23 09:47:03.479');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000e10fwrn3itc6w', 'cmpi5zp8w000410fwr68hk62m', 'copie_certifiee_conforme_du_diplome_requis_ou_equivalent', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/48a81369-74da-46c1-a061-6e8a4e2c4302.png', false, '2026-05-23 09:47:03.479');
INSERT INTO public.uploaded_documents VALUES ('cmpi5zp9z000510fwp2dzy4gl', 'cmpi5zp8w000410fwr68hk62m', 'photo', '/uploads/candidatures/cmpi5zp8w000410fwr68hk62m/6d8d336e-842c-4811-b47e-ceef9ff0d0f9.jpg', false, '2026-05-23 09:47:03.479');


--
-- PostgreSQL database dump complete
--

\unrestrict AeQVka5eYxhJ9hWT4eIWWkiDIrZhbL6IPuNxuHwgbVfukUoBbMC6KKU6FzhDXPi

