# -*- coding: utf-8 -*-
"""
Samler pedagogisk fordypningsstoff, læringsmål (LK20), sammenhenger og ordliste
for den komplette Vg1 Naturfag-læreboken om Biologi.
"""
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from biology_enrichment_parts.part_ch1_dyrecellen import CH1_DATA
from biology_enrichment_parts.part_ch2_plantecellen import CH2_DATA
from biology_enrichment_parts.part_ch3_dna import CH3_DATA
from biology_enrichment_parts.part_ch4_protein import CH4_DATA
from biology_enrichment_parts.part_ch5_genetikk import CH5_DATA
from biology_enrichment_parts.part_ch6_evolusjon import CH6_DATA
from biology_enrichment_parts.part_ch7_livets_tre import CH7_DATA
from biology_enrichment_parts.part_ch8_kroppen import CH8_DATA
from biology_enrichment_parts.part_glossary import GLOSSARY

CHAPTER_ENRICHMENTS = {
    "dyrecellen": CH1_DATA,
    "plantecellen": CH2_DATA,
    "dna-replikasjon": CH3_DATA,
    "proteinsyntesen": CH4_DATA,
    "genetikk": CH5_DATA,
    "evolusjon": CH6_DATA,
    "livets-tre": CH7_DATA,
    "kroppens-evolusjon": CH8_DATA,
}

__all__ = ["CHAPTER_ENRICHMENTS", "GLOSSARY"]
