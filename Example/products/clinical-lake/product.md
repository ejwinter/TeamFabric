# Clinical Data Lake

This is how Fabric will understand the project.  Unless asked to it will not dig into other
code or content to find more.  In that context, this should be a fairly detailed guide.

Status: Active
Owners: marcus.chen@riverdale.org
Repository: git@github.com:riverdale-health/clinical-data-lake.git

## Status

Central repository of clinical data sourced from Epic EHR. In production since 2024, serving multiple downstream consumers. Last updated 2026-03-15.

## Description

The Clinical Data Lake is the primary data store for clinical information extracted from Epic EHR. It ingests ADT events, clinical documents, lab results, and medication records via HL7v2 and batch extracts. Data lands in a Bronze/Silver/Gold lakehouse architecture on Azure Data Lake Storage Gen2, processed through Airflow-orchestrated dbt models.

## Interactions

- Upstream: Epic EHR (HL7v2 feeds, Clarity/Caboodle batch extracts)
- Downstream: Operational Dashboards (Tableau data feeds), Research Data Warehouse, Finance reporting
- Infrastructure: Azure Data Lake Storage Gen2, Azure Databricks, Airflow

## Stakeholders

- Clinical Informatics — primary consumer for quality measures and clinical reporting
- Research — de-identified data for IRB-approved studies
- Finance — cost and utilization data

## Fabric Instructions

When ingesting content related to this product, pay attention to data quality issues and schema changes from Epic upgrades. These are the most common sources of incidents.

## Context Log

<!-- Append-only breadcrumb trail. Format:
- YYYY-MM-DD - Who (channel): Summary.
  Source: [reference to original artifact]
-->
