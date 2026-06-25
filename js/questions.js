// questions.js — assembles QUESTIONS from per-section files in data/questions/
// Each section now lives in its own file for manageable file sizes (GitHub web upload friendly).
const QUESTIONS=[].concat(
  Q_VIC_MATHS,
  Q_VIC_VERBAL,
  Q_VIC_QUANT,
  Q_VIC_READING,
  Q_NSW_THINKING,
  Q_NSW_MATHS,
  Q_NSW_READING,
  Q_GEN_MATHS,
  Q_GEN_ENGLISH,
  Q_GEN_SCIENCE,
  Q_GEN_DIGITECH,
  Q_GEN_PUZZLES,
  Q_SEC_MATHS,
  Q_SEC_ENGLISH,
  Q_SEC_SCIENCE,
  Q_SR_ENGLISH,
  Q_SR_BIOLOGY,
  Q_SR_CHEMISTRY,
  Q_SR_PHYSICS,
  Q_SR_GENMATHS
,
  Q_SR_METHODS
,
  Q_SR_SPECIALIST
);
