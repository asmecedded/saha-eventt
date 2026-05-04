# 🚀 Saha Event App

Ce dépôt contient l'application de gestion d'événements développée dans le cadre de l'examen pratique. L'application est déployée sur Vercel et utilise Supabase comme solution Backend-as-a-Service.

## 🔗 Liens du Projet
* **Dépôt GitHub :** https://github.com/asmecedded/saha-eventt
* **Site Web (Vercel) :** https://saha-eventt.vercel.app/

---

## 🏛️ Mission 4 : Analyse d'Architecture

### 1. Mapping du Thème
*Mon application permet de centraliser la gestion des salles et des réservations pour des événements.*

* **Table A (Salles) :** Répertorie les lieux disponibles (nom, description, prix).
* **Table B (Réservations) :** Gère le planning et fait le lien entre utilisateurs et salles.
* **Table C (Profiles) :** Stocke les données des utilisateurs enregistrés.
* **Fichier (Images) :** Les photos illustrant les salles sont stockées dans le **Storage Supabase**.

### 2. Analyse d'Architecture (Réponses aux questions)

#### 💸 Pourquoi l'utilisation de Vercel + Supabase est financièrement plus logique qu'un serveur classique ?
Cette architecture privilégie un modèle **OPEX** (Dépenses opérationnelles). Contrairement à un serveur classique qui demande un **CAPEX** (Dépenses d'investissement) élevé (achat de serveurs physiques, installation, maintenance matérielle), Vercel et Supabase permettent de payer uniquement ce que l'on consomme. Cela réduit les coûts initiaux et les risques financiers.

#### 📈 Comment Vercel gère-t-il la scalabilité par rapport à un Data Center physique local ?
Vercel utilise une infrastructure **Serverless** répartie sur un réseau mondial (Edge Network). Dans un Data Center physique local, une montée en charge nécessiterait d'ajouter manuellement des serveurs "racks", d'ajuster la climatisation et de gérer la bande passante. Vercel, lui, distribue automatiquement les ressources nécessaires de façon virtuelle et instantanée pour absorber n'importe quel pic de trafic.

#### 📊 Dans l'application, qu'est-ce qui représente la donnée Structurée et Non-structurée ?
* **Donnée Structurée :** Ce sont les données organisées dans les tables SQL de la base de données (ex: prix, noms, dates). Elles suivent un schéma strict (lignes et colonnes).
* **Donnée Non-structurée :** Ce sont les fichiers bruts qui n'ont pas de structure de table, comme les **images des salles** ou les fichiers PDF, stockés séparément dans le Bucket (Storage).
