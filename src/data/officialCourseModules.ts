export interface ModuleQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseModuleItem {
  moduleNumber: number;
  id: string;
  title: string;
  durationHours: string;
  deliverySplit: string;
  summary: string;
  keyConcepts: string[];
  lessonNotes: string;
  codeOrCaseExample: {
    title: string;
    language: string;
    snippet: string;
    explanation: string;
  };
  handsOnLab: {
    title: string;
    taskDescription: string;
    starterTemplate: string;
    deliverableCriteria: string;
  };
  quizQuestions: ModuleQuizQuestion[];
}

export const OFFICIAL_COURSE_MODULES: Record<string, CourseModuleItem[]> = {
  "prog-01-ds-ai": [
    {
      moduleNumber: 1,
      id: "ds-ai-m1",
      title: "Python for Data Science, NumPy & Pandas Foundations",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master vectorized numerical computing, DataFrame manipulation, missing-value imputation, and high-speed feature pipelines in Python.",
      keyConcepts: [
        "Vectorized array broadcasting with NumPy vs. Python loops",
        "Pandas DataFrame indexing, groupby aggregations & multi-table joins",
        "Data cleaning: handling missing values, outliers (IQR/Z-score) & type casting",
        "Memory-efficient processing for million-row datasets",
      ],
      lessonNotes: `In enterprise Data Science, 70% of pipeline reliability comes from clean, vectorized data manipulation. Instead of iterating through rows with slow Python loops, NumPy uses contiguous C-arrays and SIMD broadcasting to compute operations 50x–100x faster.

With Pandas, you transform raw CSV/SQL/Parquet dumps into structured feature matrices:
1. Inspect schema & nulls using df.info() and df.isna().sum().
2. Impute numerical skewness using median grouped by domain category (e.g., median salary by role & city).
3. Engineer high-signal features such as rolling averages, interaction ratios, and one-hot / target encodings.`,
      codeOrCaseExample: {
        title: "Vectorized Feature Engineering & Group-Aware Imputation",
        language: "python",
        snippet: `import numpy as np
import pandas as pd

# Sample Enterprise Candidate Placement Dataset
df = pd.DataFrame({
    "candidate_id": [101, 102, 103, 104, 105],
    "sector": ["IT", "BFSI", "IT", "BFSI", "IT"],
    "test_score": [88.0, np.nan, 92.5, 79.0, np.nan],
    "projects_built": [4, 2, 6, 3, 5]
})

# Group-aware median imputation (avoids data leakage across sectors)
df["test_score"] = df.groupby("sector")["test_score"].transform(
    lambda s: s.fillna(s.median())
)

# Vectorized composite readiness index
df["readiness_index"] = np.round(df["test_score"] * 0.7 + df["projects_built"] * 5.0, 2)
print(df[["candidate_id", "sector", "test_score", "readiness_index"]])`,
        explanation: "Using groupby().transform() computes the median per sector and fills missing values inline without dropping rows or distorting sector distributions.",
      },
      handsOnLab: {
        title: "Clean & Engineer Features on a 10,000-Row Retail Transactions Dataset",
        taskDescription: "Write a Pandas pipeline that imputes missing order amounts by product category, removes extreme outliers above the 99th percentile, and computes a customer_lifetime_value (CLV) column.",
        starterTemplate: `import pandas as pd
import numpy as np

def preprocess_transactions(df: pd.DataFrame) -> pd.DataFrame:
    # 1. Fill missing 'amount' using category median
    df["amount"] = df.groupby("category")["amount"].transform(lambda x: x.fillna(x.median()))
    # 2. Cap outliers at 99th percentile
    cap = df["amount"].quantile(0.99)
    df["amount"] = np.clip(df["amount"], 0, cap)
    # 3. Compute CLV feature
    df["clv_score"] = df["amount"] * df["purchase_frequency"]
    return df`,
        deliverableCriteria: "Uses vectorized Pandas/NumPy operations (no iterrows), handles NaNs per category, and outputs a clean numerical feature column.",
      },
      quizQuestions: [
        {
          question: "Why is NumPy broadcasting significantly faster than standard Python for-loops over lists?",
          options: [
            "It executes compiled C/Fortran loops on contiguous memory blocks without per-element Python type checking",
            "It automatically uploads arrays to cloud servers",
            "It skips floating point precision calculations",
            "It converts all numbers into strings first",
          ],
          correctIndex: 0,
          explanation: "NumPy arrays store homogeneous data in contiguous memory and run vectorized C/SIMD instructions.",
        },
        {
          question: "Which Pandas method is best for filling missing values with the median of each specific subgroup?",
          options: [
            "df.dropna(inplace=True)",
            "df.groupby('group_col')['target'].transform(lambda s: s.fillna(s.median()))",
            "df.fillna(0)",
            "df.iterrows()",
          ],
          correctIndex: 1,
          explanation: "groupby().transform() preserves the original DataFrame index while computing group-specific statistics.",
        },
        {
          question: "How do you prevent data leakage when scaling or imputing features before Machine Learning?",
          options: [
            "Fit the imputer/scaler on the entire dataset before splitting",
            "Fit parameters ONLY on the training split, then transform both train and test splits",
            "Fit only on the test split",
            "Delete all rows with missing values in production",
          ],
          correctIndex: 1,
          explanation: "Fitting on test data leaks test distribution statistics into training. Always fit on train only.",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "ds-ai-m2",
      title: "Exploratory Data Analysis, Probability & Statistical Inference",
      durationHours: "32 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Apply Bayes' theorem, hypothesis testing (A/B testing, t-tests, Chi-square), confidence intervals, and correlation analysis to real datasets.",
      keyConcepts: [
        "Central Limit Theorem (CLT) & sampling distributions",
        "Parametric vs. Non-Parametric Hypothesis Testing (t-test, ANOVA, Mann-Whitney)",
        "Type I (False Positive) vs. Type II (False Negative) errors & Statistical Power",
        "Multicollinearity detection using Variance Inflation Factor (VIF)",
      ],
      lessonNotes: `Before training complex ML models, a Data Scientist must validate statistical hypotheses.
- P-value: The probability of observing a test statistic at least as extreme as the sample result, assuming the Null Hypothesis (H0) is true. When p < 0.05 (at alpha = 5%), we reject H0.
- Confidence Intervals: Provide both the point estimate and the margin of uncertainty (e.g., 95% CI for conversion lift).
- Correlation vs. Causation: Pearson's r measures linear association, whereas Spearman's rank correlation captures monotonic non-linear relationships.`,
      codeOrCaseExample: {
        title: "Two-Sample A/B Hypothesis Test with SciPy",
        language: "python",
        snippet: `import numpy as np
from scipy import stats

# Placement salary packages (in LPA) before vs after AI Capstone Training
control_batch = np.array([5.2, 5.8, 6.0, 5.5, 6.2, 5.9, 5.4, 6.1])
trained_batch = np.array([8.4, 9.1, 7.8, 8.9, 9.5, 8.2, 8.7, 9.0])

t_stat, p_val = stats.ttest_ind(trained_batch, control_batch, equal_var=False)
print(f"T-Statistic: {t_stat:.3f} | P-Value: {p_val:.6f}")
if p_val < 0.05:
    print("Statistically significant salary uplift confirmed at 95% confidence!")`,
        explanation: "Welch's t-test (equal_var=False) tests whether two independent samples have significantly different means without assuming equal variance.",
      },
      handsOnLab: {
        title: "Conduct an A/B Conversion Rate & Revenue Significance Test",
        taskDescription: "Given control and treatment checkout values, compute mean lift, run Welch's t-test, and output whether the new AI recommendation engine should be launched.",
        starterTemplate: `from scipy import stats
import numpy as np

def evaluate_ab_test(control: list[float], treatment: list[float]) -> dict:
    c_arr, t_arr = np.array(control), np.array(treatment)
    lift_pct = ((t_arr.mean() - c_arr.mean()) / c_arr.mean()) * 100
    t_stat, p_value = stats.ttest_ind(t_arr, c_arr, equal_var=False)
    return {
        "lift_percent": round(float(lift_pct), 2),
        "p_value": round(float(p_value), 5),
        "significant": bool(p_value < 0.05)
    }`,
        deliverableCriteria: "Computes percentage lift, runs a two-sample statistical test, and applies the alpha = 0.05 significance threshold.",
      },
      quizQuestions: [
        {
          question: "What does a p-value of 0.012 indicate when testing a new product feature at alpha = 0.05?",
          options: [
            "There is only a 1.2% chance the observed difference happened by random noise under H0, so we reject H0",
            "The feature failed and should be discarded",
            "The Null Hypothesis is 98.8% false in all universes",
            "Sample size is too large",
          ],
          correctIndex: 0,
          explanation: "Since p = 0.012 < 0.05, the result is statistically significant and we reject the null hypothesis.",
        },
        {
          question: "Which metric detects severe multicollinearity among independent numerical features in regression?",
          options: [
            "Gini Impurity",
            "Variance Inflation Factor (VIF > 5 or 10)",
            "BLEU Score",
            "Silhouette Coefficient",
          ],
          correctIndex: 1,
          explanation: "VIF quantifies how much the variance of an estimated regression coefficient is inflated due to collinearity with other predictors.",
        },
        {
          question: "What is a Type I Error in hypothesis testing?",
          options: [
            "Failing to detect a real effect (False Negative)",
            "Rejecting a true Null Hypothesis (False Positive)",
            "Using median instead of mean",
            "Training a model for too many epochs",
          ],
          correctIndex: 1,
          explanation: "A Type I error occurs when we falsely conclude an effect exists (rejecting a true H0), bounded by significance level alpha.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "ds-ai-m3",
      title: "Supervised & Unsupervised Machine Learning (Scikit-Learn & XGBoost)",
      durationHours: "44 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Build production Regression, Classification, Ensemble (Random Forest, XGBoost), and Clustering models with Stratified Cross-Validation.",
      keyConcepts: [
        "Bias-Variance Tradeoff, L1 (Lasso) & L2 (Ridge) Regularization",
        "Tree Ensembles: Bagging (Random Forest) vs. Gradient Boosting (XGBoost/LightGBM)",
        "Imbalanced Classification: Precision, Recall, F1-Score, ROC-AUC & SMOTE",
        "Unsupervised Clustering: K-Means, DBSCAN & PCA Dimensionality Reduction",
      ],
      lessonNotes: `In real-world tabular Machine Learning (credit scoring, churn prediction, fraud detection, demand forecasting), Gradient Boosted Decision Trees (XGBoost / LightGBM) are the industry gold standard.
- Bagging (Random Forest) trains trees in parallel on bootstrap samples to reduce variance.
- Boosting (XGBoost) trains trees sequentially where each tree minimizes the residual gradient errors of prior trees, reducing bias and variance with built-in L1/L2 regularization.
Always evaluate imbalanced datasets (e.g., 2% fraud rate) with Precision-Recall AUC and F1-Score rather than raw accuracy.`,
      codeOrCaseExample: {
        title: "End-to-End Scikit-Learn Pipeline with Stratified K-Fold & ROC-AUC",
        language: "python",
        snippet: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
import numpy as np

X = np.random.randn(200, 6)
y = (X[:, 0] + X[:, 1] * 1.5 > 0.5).astype(int)

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42))
])

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
auc_scores = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc")
print(f"5-Fold Stratified ROC-AUC: {auc_scores.mean():.4f} +/- {auc_scores.std():.4f}")`,
        explanation: "Wrapping preprocessing and model training inside a Pipeline guarantees zero data leakage across every cross-validation fold.",
      },
      handsOnLab: {
        title: "Build a Customer Churn Classifier with F1 & ROC-AUC Evaluation",
        taskDescription: "Construct a Scikit-Learn classification workflow that scales numerical features, trains a regularized classifier, and reports Precision, Recall, and F1-score.",
        starterTemplate: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

def train_churn_model(X_train, y_train, X_test, y_test):
    model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(C=1.0, class_weight="balanced"))
    ])
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    return classification_report(y_test, preds, output_dict=True)`,
        deliverableCriteria: "Uses a leak-free Pipeline, accounts for class imbalance (class_weight='balanced'), and evaluates with precision/recall/F1.",
      },
      quizQuestions: [
        {
          question: "Why is raw Accuracy a misleading metric for a medical or fraud dataset where 99% of samples are negative?",
          options: [
            "Because a dummy model that predicts 'Negative' 100% of the time achieves 99% accuracy while catching 0% of positive cases",
            "Because accuracy cannot be computed on binary labels",
            "Because accuracy is always lower than F1-score",
            "Because Scikit-Learn does not support accuracy",
          ],
          correctIndex: 0,
          explanation: "On imbalanced datasets, Precision, Recall, F1-Score, and PR-AUC measure true minority-class detection capability.",
        },
        {
          question: "What is the primary difference between Random Forest (Bagging) and XGBoost (Gradient Boosting)?",
          options: [
            "Random Forest builds independent trees in parallel; XGBoost builds trees sequentially to correct prior residual errors",
            "Random Forest only works on images; XGBoost only works on text",
            "XGBoost cannot handle missing values",
            "Random Forest uses neural networks",
          ],
          correctIndex: 0,
          explanation: "Bagging reduces variance via parallel bootstrap trees, whereas Gradient Boosting sequentially minimizes loss gradients.",
        },
        {
          question: "Which regularization penalty can shrink unimportant feature coefficients all the way to exact zero (performing feature selection)?",
          options: [
            "L2 (Ridge) Regularization",
            "L1 (Lasso) Regularization",
            "Dropout",
            "Batch Normalization",
          ],
          correctIndex: 1,
          explanation: "L1 regularization adds the absolute value of magnitude of coefficients to the loss, producing sparse solutions with zeroed weights.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "ds-ai-m4",
      title: "Deep Learning, Neural Networks & Computer Vision (PyTorch)",
      durationHours: "40 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Architect Multi-Layer Perceptrons, Convolutional Neural Networks (CNNs), Transfer Learning (ResNet/ViT), and backpropagation loops in PyTorch.",
      keyConcepts: [
        "Backpropagation, Autograd, Activation Functions (ReLU, GELU, Sigmoid, Softmax)",
        "Optimizers (AdamW, SGD with Momentum), Learning Rate Schedulers & Early Stopping",
        "Batch Normalization, Dropout & Weight Decay for preventing overfitting",
        "CNNs & Transfer Learning for Medical, Retail & Industrial Visual Inspection",
      ],
      lessonNotes: `Deep Neural Networks learn hierarchical representations directly from raw tensors.
In PyTorch, every training step follows a clean 5-line discipline:
1. optimizer.zero_grad() — Clear gradients from the previous step
2. logits = model(inputs) — Forward pass through layers
3. loss = criterion(logits, targets) — Compute differentiable loss (e.g., CrossEntropyLoss)
4. loss.backward() — Compute gradients via automatic differentiation (Autograd)
5. optimizer.step() — Update weights using AdamW / SGD`,
      codeOrCaseExample: {
        title: "PyTorch Neural Network Architecture with BatchNorm & Dropout",
        language: "python",
        snippet: `import torch
import torch.nn as nn

class EnterpriseTabularNet(nn.Module):
    def __init__(self, in_features: int, num_classes: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, 64),
            nn.BatchNorm1d(64),
            nn.GELU(),
            nn.Dropout(0.25),
            nn.Linear(64, 32),
            nn.GELU(),
            nn.Linear(32, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

model = EnterpriseTabularNet(in_features=16, num_classes=3)
sample_batch = torch.randn(8, 16)
logits = model(sample_batch)
print("Output logits shape:", logits.shape)  # torch.Size([8, 3])`,
        explanation: "Combining BatchNorm1d, GELU activations, and Dropout(0.25) stabilizes gradient flow and prevents co-adaptation of hidden neurons.",
      },
      handsOnLab: {
        title: "Write a Complete PyTorch Training Epoch Step with AdamW",
        taskDescription: "Implement the train_one_epoch function in PyTorch that clears gradients, runs forward pass, computes CrossEntropyLoss, backpropagates, and updates weights.",
        starterTemplate: `import torch
import torch.nn as nn

def train_step(model: nn.Module, optimizer: torch.optim.Optimizer, criterion: nn.Module, x: torch.Tensor, y: torch.Tensor) -> float:
    model.train()
    optimizer.zero_grad()
    logits = model(x)
    loss = criterion(logits, y)
    loss.backward()
    optimizer.step()
    return float(loss.item())`,
        deliverableCriteria: "Includes model.train(), optimizer.zero_grad(), forward pass, loss.backward(), and optimizer.step() in the right order.",
      },
      quizQuestions: [
        {
          question: "What happens if you forget to call optimizer.zero_grad() inside a PyTorch training loop?",
          options: [
            "Gradients accumulate across batches, causing incorrect weight updates",
            "The model trains twice as fast",
            "PyTorch automatically resets weights to zero",
            "The GPU shuts down",
          ],
          correctIndex: 0,
          explanation: "PyTorch accumulates gradients in .grad buffers by default; zero_grad() clears them before computing the current batch's gradient.",
        },
        {
          question: "Why is ReLU or GELU preferred over Sigmoid in deep hidden layers?",
          options: [
            "Sigmoid saturates at large positive/negative values, causing the Vanishing Gradient Problem",
            "Sigmoid cannot output positive numbers",
            "ReLU has more trainable parameters",
            "Sigmoid only works on CPU",
          ],
          correctIndex: 0,
          explanation: "Sigmoid derivatives approach 0 when |x| is large, starving earlier layers of gradient signal during backpropagation.",
        },
        {
          question: "When switching a PyTorch model from training to production inference, which two calls are essential?",
          options: [
            "model.eval() and with torch.no_grad():",
            "model.train() and loss.backward()",
            "optimizer.step() and torch.cuda.empty_cache()",
            "nn.Dropout(0.9)",
          ],
          correctIndex: 0,
          explanation: "model.eval() sets Dropout and BatchNorm to inference mode, and torch.no_grad() disables autograd memory overhead.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "ds-ai-m5",
      title: "NLP, MLOps & Production Model Deployment + Industry Capstone",
      durationHours: "40 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Package trained ML/DL models into low-latency FastAPI microservices, track experiments with MLflow, containerize with Docker, and monitor data drift.",
      keyConcepts: [
        "Model serialization (ONNX / Joblib / SafeTensors) & schema validation with Pydantic",
        "Serving low-latency REST prediction endpoints with FastAPI",
        "Experiment tracking, Model Registry & versioning with MLflow",
        "Data Drift (PSI / KS-Test) & Concept Drift monitoring in production",
      ],
      lessonNotes: `A model sitting in a Jupyter Notebook generates zero business value until it is deployed reliably in production.
In MLOps:
1. Validate incoming JSON payloads strictly using Pydantic so malformed requests never crash the inference worker.
2. Track every training run's hyperparameters, dataset hash, and validation ROC-AUC in MLflow.
3. Monitor Population Stability Index (PSI) in production—if live feature distributions shift (PSI > 0.25), trigger an automated retraining pipeline.`,
      codeOrCaseExample: {
        title: "Production FastAPI Model Inference Microservice",
        language: "python",
        snippet: `from fastapi import FastAPI
from pydantic import BaseModel, Field
import numpy as np

app = FastAPI(title="Recruits.org.in AI Placement Predictor API")

class CandidateFeatures(BaseModel):
    technical_score: float = Field(..., ge=0, le=100)
    interview_star_score: float = Field(..., ge=0, le=100)
    projects_count: int = Field(..., ge=0, le=50)

@app.post("/predict-placement")
def predict_placement(payload: CandidateFeatures):
    logit = (
        0.045 * payload.technical_score
        + 0.038 * payload.interview_star_score
        + 0.25 * payload.projects_count
        - 6.2
    )
    prob = float(1 / (1 + np.exp(-logit)))
    return {
        "placement_probability": round(prob, 4),
        "readiness_tier": "MNC Ready" if prob >= 0.75 else "Needs Mentor Lab"
    }`,
        explanation: "FastAPI + Pydantic enforces runtime constraints (0–100 scores) and auto-generates OpenAPI documentation for downstream engineering teams.",
      },
      handsOnLab: {
        title: "Build a Pydantic-Validated Model Scoring Endpoint & Drift Check",
        taskDescription: "Define a request validator schema and prediction function that returns probability, confidence tier, and checks whether input values are within expected training bounds.",
        starterTemplate: `from pydantic import BaseModel, Field

class LoanScoreRequest(BaseModel):
    credit_score: int = Field(..., ge=300, le=900)
    debt_to_income: float = Field(..., ge=0.0, le=1.0)
    annual_income_lpa: float = Field(..., gt=0)

def score_applicant(req: LoanScoreRequest) -> dict:
    risk_score = (900 - req.credit_score) * 0.1 + (req.debt_to_income * 50)
    approved = risk_score < 35 and req.annual_income_lpa >= 3.5
    return {"approved": approved, "risk_score": round(risk_score, 2)}`,
        deliverableCriteria: "Validates inputs with strict bounds and returns deterministic JSON output suitable for a production microservice.",
      },
      quizQuestions: [
        {
          question: "What is 'Data Drift' (Covariate Shift) in a deployed production ML system?",
          options: [
            "When the statistical distribution of live input features P(X) diverges significantly from the training data distribution",
            "When the server hard drive fills up",
            "When Python updates to a new minor version",
            "When the learning rate is set too high",
          ],
          correctIndex: 0,
          explanation: "Data drift occurs when live production inputs shift away from the distribution the model was trained on, degrading accuracy.",
        },
        {
          question: "Why do we use Pydantic models in FastAPI ML microservices?",
          options: [
            "To enforce strict data types, value bounds, and automatic 422 error responses before invalid data hits the ML model",
            "To train neural networks faster",
            "To replace Docker containers",
            "To encrypt SQL databases",
          ],
          correctIndex: 0,
          explanation: "Pydantic validates incoming JSON payloads at the API boundary so NaNs or out-of-range types don't break model inference.",
        },
        {
          question: "Which Population Stability Index (PSI) threshold typically signals significant feature drift requiring model retraining?",
          options: [
            "PSI > 0.25",
            "PSI = 0.0",
            "PSI < -10",
            "PSI = 0.001",
          ],
          correctIndex: 0,
          explanation: "In industry risk & MLOps standards, PSI < 0.1 indicates stability, 0.1–0.25 indicates moderate shift, and PSI > 0.25 requires action.",
        },
      ],
    },
  ],

  "prog-02-genai-agents": [
    {
      moduleNumber: 1,
      id: "genai-m1",
      title: "LLM Architecture, Transformer Internals & Advanced Prompt Engineering",
      durationHours: "28 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Understand Self-Attention, Tokenization, KV-Caching, Structured JSON Outputs, and System Instruction design using the Gemini API.",
      keyConcepts: [
        "Scaled Dot-Product Self-Attention: Query (Q), Key (K), and Value (V) projections",
        "Tokenization (Byte-Pair Encoding), Context Windows, Temperature & Top-P sampling",
        "Zero-Shot, Few-Shot, Chain-of-Thought & Structured Schema enforcement",
        "System Instructions & Guardrails against Prompt Injection",
      ],
      lessonNotes: `Large Language Models are built on the Transformer architecture. Every token attends to prior tokens via Scaled Dot-Product Attention:
Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V.
When building enterprise AI applications on Recruits.org.in & ArohiAI.com:
- Use Temperature = 0.0–0.2 for deterministic data extraction, coding, and JSON classification.
- Always enforce a strict responseSchema (or JSON schema) when downstream code parses model outputs.`,
      codeOrCaseExample: {
        title: "Structured JSON Output Generation with @google/genai SDK",
        language: "typescript",
        snippet: `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeCandidateSkillFit(resumeText: string, jobRole: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: \`Analyze candidate fit for \${jobRole}:\\n\${resumeText}\`,
    config: {
      systemInstruction: "You are an expert technical recruiter. Return strict JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchScore: { type: Type.INTEGER },
          matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["matchScore", "matchedSkills", "missingSkills"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}`,
        explanation: "Using responseMimeType: 'application/json' with responseSchema guarantees that the LLM output conforms to your TypeScript interface.",
      },
      handsOnLab: {
        title: "Design a Deterministic JSON Extraction Prompt & Schema",
        taskDescription: "Write a Gemini API call configuration that extracts job title, experience years, and mandatory skills from unstructured job descriptions.",
        starterTemplate: `export function buildExtractionConfig() {
  return {
    systemInstruction: "Extract structured job requirements accurately without hallucinating.",
    responseMimeType: "application/json",
    requiredFields: ["roleTitle", "minExperienceYears", "coreSkills"]
  };
}`,
        deliverableCriteria: "Defines a clear system instruction, JSON MIME type, and explicit required schema fields.",
      },
      quizQuestions: [
        {
          question: "In the Transformer Self-Attention formula softmax((QK^T)/sqrt(d_k))V, why do we divide by sqrt(d_k)?",
          options: [
            "To prevent large dot products in high dimensions from pushing softmax into regions with vanishingly small gradients",
            "To reduce the number of tokens in the prompt",
            "To convert text into audio",
            "To encrypt the model weights",
          ],
          correctIndex: 0,
          explanation: "Scaling by 1/sqrt(d_k) keeps the variance of the dot product near 1, preventing softmax saturation.",
        },
        {
          question: "Which sampling parameter setting is best for deterministic JSON extraction and factual classification?",
          options: [
            "Temperature = 0.0 to 0.2",
            "Temperature = 1.9",
            "Top-K = 5000",
            "Random seed disabled with high temperature",
          ],
          correctIndex: 0,
          explanation: "Low temperature concentrates probability mass on the highest-likelihood tokens, maximizing consistency.",
        },
        {
          question: "How do you guarantee an LLM returns valid, parseable JSON matching your TypeScript interface?",
          options: [
            "Provide responseMimeType: 'application/json' and a strict responseSchema in the SDK config",
            "Ask the model nicely with 'please'",
            "Use higher temperature",
            "Strip all punctuation from the prompt",
          ],
          correctIndex: 0,
          explanation: "Constrained decoding via responseSchema restricts token generation to valid grammar matching the schema.",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "genai-m2",
      title: "Enterprise RAG Pipelines, Embeddings & Vector Databases",
      durationHours: "30 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Eliminate hallucinations by grounding LLMs in enterprise PDFs, SQL databases, and semantic vector search with hybrid BM25 + Cosine reranking.",
      keyConcepts: [
        "Semantic Chunking strategies (Fixed-window with overlap vs. Markdown/Header aware)",
        "Dense Vector Embeddings & Cosine Similarity vs. Dot Product",
        "Hybrid Search: Combining Lexical (BM25 keyword) + Dense Vector retrieval",
        "Cross-Encoder Reranking & Citation Grounding",
      ],
      lessonNotes: `Retrieval-Augmented Generation (RAG) connects LLMs to private, real-time enterprise knowledge without costly weight retraining:
1. Ingestion: Split documents into semantic chunks (e.g., 512 tokens with 64-token overlap) so context isn't severed mid-sentence.
2. Embedding: Project each chunk into a high-dimensional vector space.
3. Hybrid Retrieval: Combine dense vector similarity with BM25 keyword search (essential for exact part numbers, policy codes, or OPSC notification IDs).
4. Grounded Generation: Inject top-K reranked chunks into the prompt and instruct the model to cite chunk IDs.`,
      codeOrCaseExample: {
        title: "Cosine Similarity Vector Search & Grounded Prompt Builder",
        language: "typescript",
        snippet: `export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

export function retrieveTopChunks(queryVec: number[], docs: { id: string; text: string; vec: number[] }[], k = 3) {
  return docs
    .map((d) => ({ ...d, score: cosineSimilarity(queryVec, d.vec) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}`,
        explanation: "Cosine similarity measures the angle between two embedding vectors, making it invariant to document length.",
      },
      handsOnLab: {
        title: "Implement Overlap-Aware Document Chunker for RAG",
        taskDescription: "Write a chunkTextWithOverlap function that splits a long policy document into chunks of maxLen characters with an overlap window so no sentence context is lost.",
        starterTemplate: `export function chunkTextWithOverlap(text: string, chunkSize = 400, overlap = 80): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize - overlap;
  }
  return chunks;
}`,
        deliverableCriteria: "Splits text into bounded chunks while preserving sliding window overlap between adjacent chunks.",
      },
      quizQuestions: [
        {
          question: "Why do production RAG pipelines use Hybrid Search (BM25 + Dense Vector Embeddings) instead of vector search alone?",
          options: [
            "BM25 excels at exact keyword, acronym, and ID matching while dense embeddings capture semantic meaning",
            "BM25 is a neural network that replaces LLMs",
            "Vector databases cannot store more than 10 documents",
            "Hybrid search removes the need for chunking",
          ],
          correctIndex: 0,
          explanation: "Dense embeddings can miss exact alphanumeric codes or rare proper nouns that lexical BM25 matches accurately.",
        },
        {
          question: "Why is chunk overlap (e.g., 10%–15% sliding window) important when splitting documents for RAG?",
          options: [
            "It prevents critical facts or sentences at chunk boundaries from being cut in half and losing context",
            "It reduces vector database storage cost",
            "It makes the LLM generate shorter answers",
            "It encrypts sensitive PII",
          ],
          correctIndex: 0,
          explanation: "Chunk overlap ensures that concepts spanning across a split boundary remain intact in at least one chunk.",
        },
        {
          question: "How do you prevent a RAG assistant from fabricating answers when the retrieved chunks do not contain the answer?",
          options: [
            "Instruct the system prompt to answer strictly from the provided context and state 'Insufficient information in knowledge base' if absent",
            "Set temperature to 2.0",
            "Retrieve 0 chunks",
            "Disable system instructions",
          ],
          correctIndex: 0,
          explanation: "Explicit abstention instructions combined with citation requirements keep RAG responses faithfully grounded.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "genai-m3",
      title: "Autonomous AI Agents, Tool Use / Function Calling & Multi-Agent Systems",
      durationHours: "32 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Equip LLMs with external tools (APIs, SQL queries, calculators, web search) using the ReAct loop and multi-agent supervisor orchestration.",
      keyConcepts: [
        "ReAct Pattern: Reasoning -> Tool Call -> Observation -> Final Answer",
        "Function Declarations & strict parameter typing for LLM Tool Calling",
        "Multi-Agent Patterns: Supervisor-Worker, Router, and Critic/Reflection loops",
        "Human-in-the-Loop (HITL) approval gates for high-stakes actions",
      ],
      lessonNotes: `An LLM alone is a passive text generator; an AI Agent combines an LLM reasoning core with Memory, Planning, and Tool Execution.
When a user asks: "Check my ATS score for OPSC OAS and register me for the Bhubaneswar mentor lab":
1. The Agent inspects its declared tools (calculateAtsScore, bookMentorLab).
2. It emits a structured functionCall with validated arguments.
3. Your backend executes the real function, returns the JSON result to the model, and the Agent synthesizes the final response.`,
      codeOrCaseExample: {
        title: "Agent Tool Declaration & Execution Loop",
        language: "typescript",
        snippet: `export const recruitmentAgentTools = [
  {
    name: "searchLiveJobs",
    description: "Search verified government and private jobs by role and state.",
    parameters: {
      type: "OBJECT",
      properties: {
        roleKeyword: { type: "STRING", description: "Job role e.g. Data Scientist, OPSC" },
        location: { type: "STRING", description: "City or state e.g. Odisha, Bengaluru" }
      },
      required: ["roleKeyword"]
    }
  }
];`,
        explanation: "Clear tool descriptions and typed parameters allow the LLM to decide autonomously when and how to invoke backend functions.",
      },
      handsOnLab: {
        title: "Create a Multi-Step ReAct Agent Tool Dispatcher",
        taskDescription: "Write a tool dispatcher function that receives an LLM functionCall object, executes the matching local tool safely, and returns a structured observation.",
        starterTemplate: `export async function executeAgentTool(call: { name: string; args: Record<string, any> }) {
  switch (call.name) {
    case "calculateSalaryTax": {
      const ctc = Number(call.args.ctcLPA || 12);
      return { status: "success", estimatedInHandMonthlyINR: Math.round((ctc * 82000) / 12) };
    }
    default:
      return { status: "error", message: \`Unknown tool: \${call.name}\` };
  }
}`,
        deliverableCriteria: "Validates tool name, handles arguments safely, and returns a structured JSON observation for the agent loop.",
      },
      quizQuestions: [
        {
          question: "In LLM Function Calling (Tool Use), who actually executes the database query or API call?",
          options: [
            "Your application backend executes the function after the LLM outputs a structured functionCall request",
            "The LLM directly connects to your private SQL database over the internet",
            "The browser CSS engine",
            "The tokenizer",
          ],
          correctIndex: 0,
          explanation: "The LLM only outputs the structured intent (function name + JSON arguments); your application runtime safely executes the code.",
        },
        {
          question: "What does the 'ReAct' paradigm stand for in AI Agent engineering?",
          options: [
            "Reason + Act (interleaving Chain-of-Thought reasoning traces with external tool actions and observations)",
            "React.js Frontend Components",
            "Realtime Activation Function",
            "Recursive Auto-Encoding",
          ],
          correctIndex: 0,
          explanation: "ReAct prompts the agent to Reason about the state, Act via a tool call, Observe the output, and repeat until solved.",
        },
        {
          question: "Why should autonomous agents include a max-iterations cap and Human-in-the-Loop (HITL) confirmation for destructive actions?",
          options: [
            "To prevent infinite tool-calling loops, runaway API costs, and unauthorized state mutations",
            "Because LLMs cannot count past 3",
            "To slow down the user interface",
            "To bypass authentication",
          ],
          correctIndex: 0,
          explanation: "Production agent guardrails enforce step budgets and require explicit user approval before payments, deletions, or external emails.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "genai-m4",
      title: "Parameter-Efficient Fine-Tuning (LoRA / QLoRA) & LLM Evaluation (LLM-as-a-Judge)",
      durationHours: "26 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Adapt models to domain-specific tone/formats using Low-Rank Adaptation (LoRA) and benchmark quality using automated RAGAS / Rubric evaluators.",
      keyConcepts: [
        "When to Prompt Engineer vs. RAG vs. Fine-Tune",
        "LoRA math: Freezing base weights W and training low-rank matrices A and B (r << d)",
        "4-bit Quantization (NF4) in QLoRA for single-GPU fine-tuning",
        "Evaluation metrics: Faithfulness, Answer Relevance, Context Precision & Rubric Scoring",
      ],
      lessonNotes: `Fine-tuning is for teaching a model a specialized style, domain syntax, or compact latency behavior—NOT for injecting rapidly changing facts (use RAG for dynamic facts).
Low-Rank Adaptation (LoRA) freezes the pretrained weight matrix W_0 (d x k) and injects trainable rank-decomposition matrices:
W = W_0 + B * A, where B is (d x r) and A is (r x k) with rank r (e.g., 8 or 16) << d.
This reduces trainable parameters by 99% while matching full fine-tuning performance.`,
      codeOrCaseExample: {
        title: "Automated LLM-as-a-Judge Faithfulness & Rubric Evaluator",
        language: "typescript",
        snippet: `export function evaluateResponseQuality(context: string, answer: string) {
  const contextTokens = new Set(context.toLowerCase().split(/\\W+/));
  const answerWords = answer.toLowerCase().split(/\\W+/).filter((w) => w.length > 4);
  const groundedCount = answerWords.filter((w) => contextTokens.has(w)).length;
  const lexicalGroundingRatio = answerWords.length ? groundedCount / answerWords.length : 1;

  return {
    lexicalGroundingRatio: Number(lexicalGroundingRatio.toFixed(2)),
    passedGuardrail: lexicalGroundingRatio >= 0.35 && answer.length > 20
  };
}`,
        explanation: "Combining fast lexical overlap checks with LLM-as-a-Judge rubric scoring catches hallucinations before responses reach users.",
      },
      handsOnLab: {
        title: "Calculate Parameter Savings of LoRA vs Full Fine-Tuning",
        taskDescription: "Write a function that calculates the number of trainable parameters in a linear layer of shape (4096 x 4096) under full fine-tuning vs LoRA with rank r = 16.",
        starterTemplate: `export function compareLoraParameters(d = 4096, k = 4096, r = 16) {
  const fullParams = d * k;
  const loraParams = r * (d + k);
  const reductionPercent = ((fullParams - loraParams) / fullParams) * 100;
  return { fullParams, loraParams, reductionPercent: Number(reductionPercent.toFixed(2)) };
}`,
        deliverableCriteria: "Computes full matrix parameters (d*k) vs low-rank adapter parameters r*(d+k) and percentage saved.",
      },
      quizQuestions: [
        {
          question: "For a weight matrix of size 4096 x 4096 (16.77M parameters), how many parameters does a LoRA adapter with rank r = 8 train?",
          options: [
            "65,536 parameters (8 x 4096 + 8 x 4096) — a 99.6% reduction",
            "16,777,216 parameters",
            "8 parameters",
            "100,000,000 parameters",
          ],
          correctIndex: 0,
          explanation: "LoRA trains two matrices of shapes (4096 x 8) and (8 x 4096), totaling 65,536 parameters.",
        },
        {
          question: "When should you choose RAG over Fine-Tuning?",
          options: [
            "When the application needs access to frequently updated facts, live job listings, or verifiable document citations",
            "When you have zero documents",
            "When you only want to change the JSON formatting style",
            "Never",
          ],
          correctIndex: 0,
          explanation: "RAG dynamically injects fresh, citeable facts at inference time without retraining model weights.",
        },
        {
          question: "What are the three core triad metrics in RAGAS evaluation for RAG pipelines?",
          options: [
            "Context Relevance, Groundedness (Faithfulness), and Answer Relevance",
            "FPS, Ping, and Jitter",
            "HTML, CSS, and JS",
            "Mean, Median, and Mode",
          ],
          correctIndex: 0,
          explanation: "The RAG triad evaluates whether the right context was retrieved, whether the answer stayed faithful to that context, and whether it answered the user's question.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "genai-m5",
      title: "Full-Stack AI Product Deployment, Streaming & ArohiAI.com Capstone",
      durationHours: "34 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Ship production AI web applications with Server-Sent Events (SSE) streaming, rate limiting, semantic caching, and safety guardrails.",
      keyConcepts: [
        "Low-latency token streaming (SSE / Async Iterators) for responsive UX",
        "Semantic Caching & Token Budget management to cut API costs by 60%",
        "PII Redaction & Prompt Injection Defense layers",
        "Capstone: Building an End-to-End Domain AI Copilot",
      ],
      lessonNotes: `Users perceive an AI application as instantaneous when Time-To-First-Token (TTFT) is under 400ms via streaming.
In production architectures (like Recruits.org.in powered by ArohiAI.com):
1. Never expose your GEMINI_API_KEY in client-side browser bundles—always proxy through secure Express/Node backend routes (/api/ai/*).
2. Redact sensitive PII (Aadhaar, PAN, passwords) before logging prompts.
3. Implement graceful fallback responses if upstream rate limits occur.`,
      codeOrCaseExample: {
        title: "PII Redaction & Prompt Sanitization Middleware",
        language: "typescript",
        snippet: `export function sanitizeUserPrompt(rawPrompt: string): { cleanPrompt: string; redactedCount: number } {
  let count = 0;
  // Redact 12-digit Aadhaar-like numbers & PAN patterns
  const cleanPrompt = rawPrompt
    .replace(/\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b/g, () => { count++; return "[REDACTED_ID]"; })
    .replace(/\\b[A-Z]{5}\\d{4}[A-Z]\\b/g, () => { count++; return "[REDACTED_PAN]"; });
  return { cleanPrompt, redactedCount: count };
}`,
        explanation: "Sanitizing prompts at the API gateway protects user privacy and ensures compliance before data reaches external logs.",
      },
      handsOnLab: {
        title: "Build a Prompt Guardrail & Token Cost Estimator",
        taskDescription: "Write a utility that checks for prompt injection keywords, estimates token count (~4 chars/token), and computes estimated cost.",
        starterTemplate: `export function inspectPromptSafety(prompt: string) {
  const blockedPatterns = [/ignore all previous instructions/i, /reveal system prompt/i];
  const isSafe = !blockedPatterns.some((rx) => rx.test(prompt));
  const estimatedTokens = Math.ceil(prompt.length / 4);
  return { isSafe, estimatedTokens };
}`,
        deliverableCriteria: "Detects adversarial override patterns and computes token budget estimation.",
      },
      quizQuestions: [
        {
          question: "Why must LLM API keys (such as GEMINI_API_KEY) NEVER be placed inside frontend React browser code?",
          options: [
            "Anyone can inspect the browser network tab or JS bundle and steal the key, leading to quota theft",
            "Browser JavaScript cannot make HTTP requests",
            "React does not support strings",
            "It makes the font size smaller",
          ],
          correctIndex: 0,
          explanation: "All client-bundled variables are publicly visible in the browser; API keys must stay on the server side.",
        },
        {
          question: "What UX metric improves dramatically when using Server-Sent Events (SSE) token streaming?",
          options: [
            "Time-To-First-Token (TTFT), allowing users to read the response immediately as it generates",
            "Database disk size",
            "Monitor refresh rate",
            "DNS lookup speed",
          ],
          correctIndex: 0,
          explanation: "Streaming delivers tokens incrementally within milliseconds instead of making the user wait 5–10 seconds for the full paragraph.",
        },
        {
          question: "What is 'Prompt Injection' in LLM security?",
          options: [
            "When untrusted user input attempts to override the developer's system instructions to hijack model behavior",
            "Passing a systemInstruction parameter in the SDK",
            "Using few-shot examples",
            "Compressing prompts to save tokens",
          ],
          correctIndex: 0,
          explanation: "Prompt injection occurs when adversarial text inside user input or retrieved documents tries to subvert system rules.",
        },
      ],
    },
  ],

  "prog-03-cybersecurity": [
    {
      moduleNumber: 1,
      id: "cyber-m1",
      title: "Networking Fundamentals, Linux Security Hardening & Applied Cryptography",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master TCP/IP packet analysis, Linux permissions, SSH hardening, AES-GCM symmetric encryption, RSA/ECC public-key infrastructure, and SHA-256 hashing.",
      keyConcepts: [
        "OSI & TCP/IP stack: 3-Way Handshake (SYN, SYN-ACK, ACK), TLS 1.3 & DNSSEC",
        "Linux Privilege Management: chmod, chown, sudoers, SELinux & iptables/ufw",
        "Symmetric (AES-256-GCM) vs. Asymmetric (RSA / ECDHE) Encryption",
        "Password Hashing with Salt (Argon2id / bcrypt / PBKDF2) vs. plain SHA-256",
      ],
      lessonNotes: `Every cybersecurity engineer must understand how bytes move across the wire and how operating systems enforce access control.
- Never store passwords as unsalted hashes: Attackers use precomputed Rainbow Tables to crack raw MD5/SHA1 hashes in milliseconds. Always use salted, memory-hard hashing like Argon2id or PBKDF2/bcrypt.
- TLS 1.3 uses Ephemeral Diffie-Hellman (ECDHE) for Forward Secrecy—even if a server's private key is compromised years later, past recorded traffic cannot be decrypted.`,
      codeOrCaseExample: {
        title: "Cryptographic Salted Password Verification with Node.js Crypto",
        language: "typescript",
        snippet: `import crypto from "crypto";

export function hashPasswordPBKDF2(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return \`\${salt}:\${hash}\`;
}

export function verifyPasswordPBKDF2(password: string, stored: string): boolean {
  const [salt, originalHash] = stored.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
}`,
        explanation: "Using a unique 16-byte random salt per user plus timingSafeEqual prevents both Rainbow Table attacks and timing side-channel leaks.",
      },
      handsOnLab: {
        title: "Audit Firewall Rules & Verify HMAC Webhook Signature",
        taskDescription: "Write a function that validates an incoming webhook payload using HMAC-SHA256 to guarantee authenticity and integrity.",
        starterTemplate: `import crypto from "crypto";

export function verifyWebhookHmac(payload: string, secret: string, signatureHex: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signatureHex;
}`,
        deliverableCriteria: "Computes HMAC-SHA256 digest using the shared secret and verifies equality with the signature.",
      },
      quizQuestions: [
        {
          question: "Why do we use crypto.timingSafeEqual() when comparing authentication hashes or HMAC tokens?",
          options: [
            "To prevent timing side-channel attacks where an attacker guesses bytes one by one based on microsecond response differences",
            "Because === does not work on strings in JavaScript",
            "To compress the hash size",
            "To speed up database queries",
          ],
          correctIndex: 0,
          explanation: "Standard string comparison short-circuits on the first mismatched byte, leaking information via response time.",
        },
        {
          question: "What does 'Perfect Forward Secrecy' (PFS) in TLS 1.3 guarantee?",
          options: [
            "Compromise of the server's long-term private key in the future will NOT decrypt past captured session traffic",
            "Packets travel faster than light",
            "Firewalls are no longer needed",
            "Passwords never expire",
          ],
          correctIndex: 0,
          explanation: "Ephemeral session keys are negotiated per connection and discarded immediately after use.",
        },
        {
          question: "Which Linux file permission octal mode grants read+write to the owner ONLY and zero access to group or others (required for SSH private keys)?",
          options: [
            "chmod 600",
            "chmod 777",
            "chmod 644",
            "chmod 755",
          ],
          correctIndex: 0,
          explanation: "600 corresponds to rw------- (owner read/write, no permissions for group or world).",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "cyber-m2",
      title: "Reconnaissance, Vulnerability Assessment & Penetration Testing (VAPT)",
      durationHours: "38 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Conduct authorized OSINT, network enumeration with Nmap, CVE scoring (CVSS v3.1), and structured penetration testing reports.",
      keyConcepts: [
        "Rules of Engagement (RoE) & Legal Authorization in Ethical Hacking",
        "Passive OSINT (Subdomain enumeration, certificate transparency logs) vs. Active Scanning",
        "Nmap service/version fingerprinting & vulnerability script scanning",
        "CVSS v3.1 Severity Scoring & Remediation Prioritization",
      ],
      lessonNotes: `Ethical Hacking always begins with explicit written authorization (Rules of Engagement).
During VAPT:
1. Reconnaissance maps the attack surface (exposed subdomains, forgotten staging servers, open ports).
2. Enumeration identifies exact service versions (e.g., OpenSSH, Nginx, PostgreSQL) and cross-references known CVEs.
3. Reporting translates technical findings into CVSS scores and actionable engineering patches.`,
      codeOrCaseExample: {
        title: "Attack Surface Port Risk Analyzer",
        language: "typescript",
        snippet: `export function assessOpenPortsRisk(openPorts: number[]) {
  const highRiskPorts: Record<number, string> = {
    21: "FTP (Unencrypted Cleartext Credentials)",
    23: "Telnet (Unencrypted Remote Shell - Critical)",
    445: "SMB (Ransomware / Lateral Movement Vector)",
    3389: "RDP (Brute-Force Target - Place behind VPN/Zero-Trust)",
    6379: "Redis (Often unauthenticated if bound to 0.0.0.0)"
  };
  return openPorts.map((port) => ({
    port,
    severity: highRiskPorts[port] ? "HIGH" : "INFO",
    advisory: highRiskPorts[port] || "Standard service port — verify TLS & patch level"
  }));
}`,
        explanation: "Automatically flagging exposed management and legacy cleartext ports helps DevSecOps teams lock down cloud security groups.",
      },
      handsOnLab: {
        title: "Build a CVSS Risk Prioritizer for Security Audits",
        taskDescription: "Categorize a list of CVE findings by CVSS score into Critical (>=9.0), High (7.0-8.9), Medium (4.0-6.9), and Low (<4.0) with SLA deadlines.",
        starterTemplate: `export function classifyCvssSeverity(score: number) {
  if (score >= 9.0) return { rating: "CRITICAL", patchSlaHours: 24 };
  if (score >= 7.0) return { rating: "HIGH", patchSlaHours: 72 };
  if (score >= 4.0) return { rating: "MEDIUM", patchSlaHours: 336 };
  return { rating: "LOW", patchSlaHours: 720 };
}`,
        deliverableCriteria: "Maps numerical CVSS scores to standard NIST/FIRST severity tiers and remediation SLAs.",
      },
      quizQuestions: [
        {
          question: "What is the mandatory first step before performing any active penetration test on an organization?",
          options: [
            "Obtaining signed written authorization and defining the Rules of Engagement (RoE) scope",
            "Running a DDoS attack",
            "Publishing findings on social media",
            "Disabling production backups",
          ],
          correctIndex: 0,
          explanation: "Testing without explicit written permission is illegal; RoE defines authorized IP ranges, time windows, and escalation contacts.",
        },
        {
          question: "Which protocol on port 23 transmits credentials in raw cleartext and must always be replaced by SSH (port 22)?",
          options: [
            "Telnet",
            "HTTPS",
            "SFTP",
            "DNSSEC",
          ],
          correctIndex: 0,
          explanation: "Telnet sends all keystrokes including passwords in unencrypted plaintext over the network.",
        },
        {
          question: "A vulnerability has a CVSS v3.1 base score of 9.8. What severity rating does this represent?",
          options: [
            "Critical (9.0 – 10.0)",
            "Low (0.1 – 3.9)",
            "Medium (4.0 – 6.9)",
            "Informational",
          ],
          correctIndex: 0,
          explanation: "CVSS scores from 9.0 to 10.0 are classified as Critical and require emergency patching.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "cyber-m3",
      title: "Web Application Security (OWASP Top 10) & API Defense Lab",
      durationHours: "42 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Identify and remediate Broken Access Control (IDOR), SQL Injection, XSS, CSRF, SSRF, and JWT authentication flaws.",
      keyConcepts: [
        "OWASP Top 10: #1 Broken Access Control (IDOR) & #3 Injection (SQLi / Command Injection)",
        "Parameterized Prepared Statements vs. vulnerable string concatenation",
        "Cross-Site Scripting (XSS) defense via Content-Security-Policy (CSP) & output encoding",
        "Server-Side Request Forgery (SSRF) protection on cloud metadata endpoints (169.254.169.254)",
      ],
      lessonNotes: `Broken Access Control and Injection remain the most exploited web vulnerabilities globally.
1. SQL Injection (SQLi): Occurs when user input is concatenated directly into a SQL string. Always use Parameterized Queries / Prepared Statements so the database treats input strictly as literal data, never executable SQL grammar.
2. IDOR (Insecure Direct Object Reference): Never trust a client-supplied user_id or invoice_id without verifying in the backend session that the authenticated user owns that resource.`,
      codeOrCaseExample: {
        title: "Remediating SQL Injection & IDOR in Backend APIs",
        language: "typescript",
        snippet: `// VULNERABLE (NEVER DO THIS):
// const query = \`SELECT * FROM payslips WHERE id = '\${req.params.id}'\`;

// SECURE: Parameterized Query + Ownership Authorization Check (Anti-IDOR)
export async function getCandidatePayslipSecure(db: any, payslipId: string, authenticatedUserId: string) {
  const sql = "SELECT id, amount, month FROM payslips WHERE id = $1 AND owner_user_id = $2";
  const result = await db.query(sql, [payslipId, authenticatedUserId]);
  if (result.rows.length === 0) {
    throw new Error("403 Forbidden or 404 Not Found");
  }
  return result.rows[0];
}`,
        explanation: "Binding parameters ($1, $2) neutralizes SQL injection, and scoping the query by authenticatedUserId prevents horizontal privilege escalation (IDOR).",
      },
      handsOnLab: {
        title: "Write an Anti-SSRF URL Validator for Webhook Fetchers",
        taskDescription: "Implement a URL validator that blocks internal private IP ranges (127.0.0.1, localhost, 169.254.169.254 cloud metadata) to prevent SSRF attacks.",
        starterTemplate: `export function isSafeExternalUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") return false;
    const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254"];
    if (blockedHosts.includes(parsed.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}`,
        deliverableCriteria: "Enforces HTTPS and blocks loopback and cloud instance metadata IP addresses.",
      },
      quizQuestions: [
        {
          question: "What is the primary defense that completely prevents SQL Injection?",
          options: [
            "Using Parameterized Queries (Prepared Statements) so user input is never interpreted as SQL commands",
            "Hiding the login button with CSS",
            "Using HTTP instead of HTTPS",
            "Renaming database tables",
          ],
          correctIndex: 0,
          explanation: "Prepared statements compile the SQL structure in advance and bind user parameters strictly as scalar values.",
        },
        {
          question: "Why do attackers target IP 169.254.169.254 during a Server-Side Request Forgery (SSRF) attack on cloud servers?",
          options: [
            "It is the link-local Cloud Instance Metadata Service (IMDS) endpoint that can expose temporary IAM credentials",
            "It is Google's public DNS server",
            "It is the browser's local storage",
            "It is a CSS stylesheet host",
          ],
          correctIndex: 0,
          explanation: "Cloud providers expose instance metadata at 169.254.169.254; SSRF defenses and IMDSv2 token requirements block unauthorized access.",
        },
        {
          question: "Which HTTP cookie flags protect session tokens from being stolen via XSS or sent over unencrypted connections?",
          options: [
            "HttpOnly, Secure, and SameSite=Strict/Lax",
            "Public and Cleartext",
            "Allow-All-Scripts",
            "No-Cache",
          ],
          correctIndex: 0,
          explanation: "HttpOnly blocks document.cookie access from JavaScript (mitigating XSS token theft), and Secure restricts transmission to HTTPS.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "cyber-m4",
      title: "SOC Operations, SIEM Log Analysis, Incident Response & Threat Hunting",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Detect brute-force attacks, privilege escalation, and lateral movement using SIEM correlation rules, MITRE ATT&CK mapping, and NIST Incident Response.",
      keyConcepts: [
        "MITRE ATT&CK Framework: Tactics, Techniques, and Procedures (TTPs)",
        "SIEM Log Ingestion, Normalization & Correlation Rules",
        "NIST SP 800-61 Incident Response Lifecycle (Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned)",
        "Digital Forensics: Memory volatile capture, Indicators of Compromise (IoCs) & Chain of Custody",
      ],
      lessonNotes: `A Security Operations Center (SOC) continuously monitors enterprise telemetry to reduce Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR).
When a high-severity alert fires:
1. Triage & Verify: Correlate auth logs, EDR process trees, and DNS queries to distinguish true positives from benign admin activity.
2. Containment: Isolate the compromised host from the network before wiping it, preserving volatile RAM forensics.`,
      codeOrCaseExample: {
        title: "SIEM Brute-Force & Credential Stuffing Detector",
        language: "typescript",
        snippet: `export interface AuthEvent {
  ip: string;
  username: string;
  success: boolean;
  timestampMs: number;
}

export function detectBruteForceIPs(events: AuthEvent[], threshold = 5): string[] {
  const failedCounts: Record<string, number> = {};
  for (const ev of events) {
    if (!ev.success) {
      failedCounts[ev.ip] = (failedCounts[ev.ip] || 0) + 1;
    }
  }
  return Object.entries(failedCounts)
    .filter(([_, count]) => count >= threshold)
    .map(([ip]) => ip);
}`,
        explanation: "Aggregating failed authentication events per source IP over a sliding window triggers automated WAF IP blocking.",
      },
      handsOnLab: {
        title: "Write a SIEM Log Correlation Rule for Impossible Travel",
        taskDescription: "Detect when the same user logs in from two geographically distant countries within 15 minutes (Impossible Travel anomaly).",
        starterTemplate: `export function isImpossibleTravel(login1: { country: string; timeMin: number }, login2: { country: string; timeMin: number }): boolean {
  const diffMinutes = Math.abs(login2.timeMin - login1.timeMin);
  return login1.country !== login2.country && diffMinutes <= 15;
}`,
        deliverableCriteria: "Flags rapid cross-country logins within an physically impossible travel window.",
      },
      quizQuestions: [
        {
          question: "According to the NIST Incident Response lifecycle, what must happen BEFORE 'Eradication and Recovery'?",
          options: [
            "Containment (isolating affected systems to stop lateral spread while preserving forensic evidence)",
            "Deleting all server logs immediately",
            "Shutting down the company",
            "Ignoring the alert for 30 days",
          ],
          correctIndex: 0,
          explanation: "Containment stops the bleeding and prevents the attacker from pivoting to other servers while preserving evidence.",
        },
        {
          question: "What is the MITRE ATT&CK framework used for in SOC operations?",
          options: [
            "Mapping adversary Tactics, Techniques, and Procedures (TTPs) across the cyber kill chain",
            "Designing company logos",
            "Compressing video files",
            "Calculating payroll taxes",
          ],
          correctIndex: 0,
          explanation: "MITRE ATT&CK is a globally accessible knowledge base of real-world adversary behaviors and TTPs.",
        },
        {
          question: "In digital forensics, which data source is most volatile and must be captured FIRST before powering off a compromised machine?",
          options: [
            "CPU Registers, System RAM (Memory), and active network connections",
            "Printed paper manuals",
            "Cold tape archives",
            "External backup DVDs",
          ],
          correctIndex: 0,
          explanation: "Order of Volatility dictates capturing RAM and active network state first because powering off destroys volatile memory.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "cyber-m5",
      title: "Cloud Security, Zero-Trust Architecture & Red/Blue Team Capstone",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Secure AWS/GCP IAM policies with Principle of Least Privilege, container image scanning, Supply Chain Security (SBOM), and Zero-Trust mTLS.",
      keyConcepts: [
        "Zero-Trust Principle: 'Never Trust, Always Verify' & Continuous Authentication",
        "Cloud IAM Least Privilege: Eliminating wildcard Action: '*' and Resource: '*'",
        "DevSecOps Pipeline: SAST, DAST, Secret Scanning & Container Image CVE Scanning",
        "Red Team vs. Blue Team Purple-Teaming Capstone Exercise",
      ],
      lessonNotes: `Traditional perimeter security ('castle-and-moat' VPN) fails once an attacker compromises a single internal laptop.
Zero-Trust Architecture requires:
1. Strong identity verification (MFA / Passkeys / mTLS) for every service-to-service and user-to-service request.
2. Micro-segmentation and Least Privilege IAM policies.
3. Automated secret scanning in Git pre-commit hooks so cloud credentials never leak into repositories.`,
      codeOrCaseExample: {
        title: "Cloud IAM Policy Least-Privilege Auditor",
        language: "typescript",
        snippet: `export interface IamStatement {
  Effect: "Allow" | "Deny";
  Action: string | string[];
  Resource: string;
}

export function auditIamPolicyRisks(statements: IamStatement[]) {
  const violations: string[] = [];
  for (const stmt of statements) {
    const actions = Array.isArray(stmt.Action) ? stmt.Action : [stmt.Action];
    if (stmt.Effect === "Allow" && actions.includes("*") && stmt.Resource === "*") {
      violations.push("CRITICAL: Wildcard Admin Access (Action: '*' on Resource: '*') violates Least Privilege.");
    }
  }
  return { passed: violations.length === 0, violations };
}`,
        explanation: "Automated policy-as-code checks block overly permissive IAM roles in CI/CD before Terraform applies them.",
      },
      handsOnLab: {
        title: "Build a Git Pre-Commit Secret Scanner for Cloud Keys",
        taskDescription: "Write a scanner function that detects accidentally hardcoded AWS Access Keys (AKIA...) or private key headers in source code.",
        starterTemplate: `export function scanCodeForSecrets(sourceCode: string) {
  const awsKeyRegex = /AKIA[0-9A-Z]{16}/;
  const privateKeyRegex = /-----BEGIN (RSA |EC )?PRIVATE KEY-----/;
  const hasLeak = awsKeyRegex.test(sourceCode) || privateKeyRegex.test(sourceCode);
  return { clean: !hasLeak, alert: hasLeak ? "Hardcoded secret detected!" : "No secrets found" };
}`,
        deliverableCriteria: "Detects high-risk cloud key patterns and blocks unsafe commits.",
      },
      quizQuestions: [
        {
          question: "What is the core motto of Zero-Trust Security Architecture?",
          options: [
            "Never Trust, Always Verify (authenticate and authorize every request regardless of network location)",
            "Trust everything inside the office Wi-Fi",
            "Disable all passwords for convenience",
            "Use a single shared admin account",
          ],
          correctIndex: 0,
          explanation: "Zero-Trust eliminates implicit trust based on network location and verifies identity, device posture, and least privilege on every request.",
        },
        {
          question: "Why is an IAM policy with Effect: 'Allow', Action: '*', Resource: '*' dangerous in production cloud environments?",
          options: [
            "It grants unrestricted root-equivalent administrative privileges if the role is compromised",
            "It makes S3 buckets read-only",
            "It slows down DNS resolution",
            "It is required for all public websites",
          ],
          correctIndex: 0,
          explanation: "Wildcard permissions violate the Principle of Least Privilege and allow full lateral takeover upon credential compromise.",
        },
        {
          question: "What should you do FIRST if a developer accidentally pushes an AWS or GCP secret key to a Git repository?",
          options: [
            "Immediately revoke/rotate the compromised key in the Cloud IAM console, then purge history",
            "Just add a new commit deleting the line and keep using the same key",
            "Rename the repository",
            "Wait until next month's audit",
          ],
          correctIndex: 0,
          explanation: "Bots scrape public and internal Git logs in seconds; deleting the line in a new commit leaves the key in Git history, so immediate revocation is mandatory.",
        },
      ],
    },
  ],

  "prog-04-cloud-devops": [
    {
      moduleNumber: 1,
      id: "cloud-m1",
      title: "Linux System Administration, Networking & Automation Scripting",
      durationHours: "30 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master Linux process management (systemd), networking (VPCs, CIDR subnets, load balancers, DNS), and fault-tolerant Bash/Python automation.",
      keyConcepts: [
        "Linux filesystem hierarchy, systemd unit services, journalctl & resource limits (ulimit/cgroups)",
        "CIDR Subnetting (e.g., /16 VPC split into public/private /24 subnets), NAT Gateways & Route Tables",
        "Layer 4 (TCP/UDP) vs. Layer 7 (HTTP/HTTPS host/path) Load Balancing",
        "Defensive Bash scripting with set -euo pipefail",
      ],
      lessonNotes: `Every Cloud & DevOps platform runs on Linux and software-defined networking.
- CIDR Notation: An IPv4 address has 32 bits. A /24 subnet masks the first 24 bits, leaving 2^(32-24) = 256 IP addresses.
- Defensive Automation: Always start deployment shell scripts with \`set -euo pipefail\` so any failed command or unset variable immediately halts execution instead of cascading silent failures.`,
      codeOrCaseExample: {
        title: "CIDR Subnet Capacity Calculator for Cloud VPC Design",
        language: "typescript",
        snippet: `export function calculateCidrSubnetHosts(prefixLength: number) {
  const hostBits = 32 - prefixLength;
  const totalIPs = Math.pow(2, hostBits);
  // AWS/GCP reserve 4-5 IPs per subnet (Network, Router, DNS, Broadcast)
  const awsUsableHosts = Math.max(0, totalIPs - 5);
  return { prefix: \`/\${prefixLength}\`, totalIPs, awsUsableHosts };
}`,
        explanation: "Cloud providers reserve 5 IP addresses in every CIDR block (first 4 and last 1), which architects must account for when sizing Kubernetes node subnets.",
      },
      handsOnLab: {
        title: "Write a Health-Check Auto-Recovery Logic for Production Services",
        taskDescription: "Implement a health check evaluator that inspects CPU load, memory usage, and HTTP status code to decide whether to trigger an auto-restart or scale-out event.",
        starterTemplate: `export function evaluateNodeHealth(httpStatus: number, cpuPercent: number, memPercent: number) {
  if (httpStatus !== 200) return { action: "RESTART_CONTAINER", healthy: false };
  if (cpuPercent > 85 || memPercent > 90) return { action: "SCALE_OUT_REPLICA", healthy: true };
  return { action: "NO_ACTION", healthy: true };
}`,
        deliverableCriteria: "Distinguishes between service crash (non-200 status -> restart) and high load (>85% CPU -> horizontal scale-out).",
      },
      quizQuestions: [
        {
          question: "How many total IPv4 addresses are in a /24 CIDR block (and how many are usable in an AWS subnet)?",
          options: [
            "256 total IPs (251 usable in AWS after 5 reserved IPs)",
            "65,536 total IPs",
            "24 total IPs",
            "1,024 total IPs",
          ],
          correctIndex: 0,
          explanation: "2^(32-24) = 2^8 = 256 addresses; AWS reserves 5 addresses per subnet.",
        },
        {
          question: "Why should production databases be placed in a Private Subnet rather than a Public Subnet?",
          options: [
            "Private subnets have no direct inbound route from the public Internet Gateway, protecting data stores from external scanning",
            "Private subnets have faster CPUs",
            "Public subnets do not support SQL",
            "Private subnets are free of cost",
          ],
          correctIndex: 0,
          explanation: "Isolating databases in private subnets ensures only authorized application servers inside the VPC security group can reach them.",
        },
        {
          question: "What does 'set -euo pipefail' do at the top of a DevOps Bash script?",
          options: [
            "Exits immediately on command error (-e), unset variables (-u), or failed pipeline stages (-o pipefail)",
            "Runs the script in an infinite loop",
            "Deletes temporary log files",
            "Disables firewall rules",
          ],
          correctIndex: 0,
          explanation: "It prevents partial or broken deployments from continuing silently after an error.",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "cloud-m2",
      title: "Core Cloud Architecture (AWS, GCP & Azure Compute, Storage & High Availability)",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Design Multi-AZ fault-tolerant architectures using Auto Scaling Groups, S3/Cloud Storage lifecycle policies, RDS Multi-AZ, and CDN edge caching.",
      keyConcepts: [
        "Well-Architected Framework: Operational Excellence, Security, Reliability, Performance, Cost Optimization",
        "High Availability (Multi-AZ) vs. Disaster Recovery (Multi-Region RPO & RTO)",
        "Object Storage (S3 / GCS) vs. Block Storage (EBS) vs. File Storage (EFS)",
        "Serverless Compute (AWS Lambda / Google Cloud Run) scale-to-zero economics",
      ],
      lessonNotes: `Cloud Architects design systems around two critical resilience metrics:
- RPO (Recovery Point Objective): Maximum acceptable age of data lost during an outage (e.g., 5 minutes -> requires continuous WAL replication).
- RTO (Recovery Time Objective): Maximum acceptable downtime before service is restored (e.g., < 60 seconds -> requires Multi-AZ automatic failover).`,
      codeOrCaseExample: {
        title: "Cloud SLA Uptime & Allowed Downtime Calculator",
        language: "typescript",
        snippet: `export function calculateSlaDowntime(slaPercent: number) {
  const minutesPerYear = 365 * 24 * 60; // 525,600 minutes
  const allowedDowntimeMinutesPerYear = minutesPerYear * ((100 - slaPercent) / 100);
  return {
    slaPercent,
    allowedMinutesPerYear: Number(allowedDowntimeMinutesPerYear.toFixed(2)),
    tier: slaPercent >= 99.99 ? "Four Nines (Fault-Tolerant Multi-AZ)" : "Standard HA"
  };
}`,
        explanation: "At 99.99% ('Four Nines') availability, an enterprise system is allowed only 52.56 minutes of total unplanned downtime per year.",
      },
      handsOnLab: {
        title: "Design an S3 / Cloud Storage Cost Tiering Lifecycle Estimator",
        taskDescription: "Write a cost estimator that calculates monthly storage cost when moving logs from Standard ($0.023/GB) to Glacier Archive ($0.004/GB) after 30 days.",
        starterTemplate: `export function estimateStorageSavings(hotGb: number, archiveGb: number) {
  const allStandardCost = (hotGb + archiveGb) * 0.023;
  const tieredCost = hotGb * 0.023 + archiveGb * 0.004;
  return {
    allStandardUSD: Number(allStandardCost.toFixed(2)),
    tieredUSD: Number(tieredCost.toFixed(2)),
    monthlySavingsUSD: Number((allStandardCost - tieredCost).toFixed(2))
  };
}`,
        deliverableCriteria: "Calculates storage cost reduction achieved by automated object lifecycle tiering.",
      },
      quizQuestions: [
        {
          question: "What is the difference between RPO (Recovery Point Objective) and RTO (Recovery Time Objective)?",
          options: [
            "RPO measures maximum tolerable data loss in time; RTO measures maximum tolerable service downtime",
            "RPO is for CPU; RTO is for RAM",
            "They are identical metrics",
            "RPO only applies to frontend CSS",
          ],
          correctIndex: 0,
          explanation: "RPO dictates backup/replication frequency, while RTO dictates failover automation speed.",
        },
        {
          question: "How much unplanned downtime per year is permitted under a 'Four Nines' (99.99%) SLA?",
          options: [
            "Approximately 52.6 minutes per year",
            "3.65 days per year",
            "100 hours per year",
            "Zero nanoseconds",
          ],
          correctIndex: 0,
          explanation: "0.01% of 525,600 minutes/year equals 52.56 minutes.",
        },
        {
          question: "Which cloud storage class is best suited for storing billions of unstructured user resume PDFs and media assets?",
          options: [
            "Object Storage (Amazon S3 / Google Cloud Storage)",
            "CPU L1 Cache",
            "Local ephemeral NVMe scratch disk",
            "DNS TXT records",
          ],
          correctIndex: 0,
          explanation: "Object storage provides 11 nines (99.999999999%) of durability, infinite horizontal scale, and lifecycle tiering.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "cloud-m3",
      title: "Containerization with Docker & Multi-Stage Microservices",
      durationHours: "32 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Build minimal, secure production container images using multi-stage Dockerfiles, distroless/alpine bases, non-root users, and Docker Compose.",
      keyConcepts: [
        "OS Namespaces (isolation) & Cgroups (resource limits) vs. Virtual Machines",
        "Multi-stage Docker builds: Separating build-time compilers from minimal runtime images",
        "Layer caching optimization & running containers as non-root USER",
        "Docker networking (bridge, host, overlay) & persistent volumes",
      ],
      lessonNotes: `A naive Dockerfile bundles devDependencies, TypeScript compilers, and build caches into a bloated 1.2GB image full of CVEs.
A production Multi-Stage Dockerfile:
1. Stage 1 (builder): Installs dependencies and runs \`npm run build\`.
2. Stage 2 (runner): Starts from \`node:22-alpine\`, copies ONLY the compiled \`dist/\` folder and production dependencies, and switches to \`USER node\` (non-root) so a container breakout cannot gain host root privileges.`,
      codeOrCaseExample: {
        title: "Production Multi-Stage Non-Root Dockerfile",
        language: "dockerfile",
        snippet: `# Stage 1: Build Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
        explanation: "Copying package.json before source code maximizes Docker layer caching, and multi-stage copying reduces final image size by ~80%.",
      },
      handsOnLab: {
        title: "Write a Dockerfile Security & Layer Optimization Linter",
        taskDescription: "Inspect a Dockerfile string and verify that it uses a multi-stage build (FROM ... AS), sets a non-root USER, and avoids `:latest` unpinned tags.",
        starterTemplate: `export function lintDockerfile(dockerfileText: string) {
  const isMultiStage = /FROM\\s+\\S+\\s+AS\\s+/i.test(dockerfileText);
  const hasNonRootUser = /^USER\\s+(?!root)\\S+/m.test(dockerfileText);
  const usesLatestTag = /FROM\\s+\\S+:latest/i.test(dockerfileText);
  return {
    score: (isMultiStage ? 40 : 0) + (hasNonRootUser ? 40 : 0) + (!usesLatestTag ? 20 : 0),
    isMultiStage,
    hasNonRootUser,
    usesPinVersion: !usesLatestTag
  };
}`,
        deliverableCriteria: "Checks for multi-stage syntax, non-root USER directive, and deterministic version pinning.",
      },
      quizQuestions: [
        {
          question: "Why do we copy package.json and run npm ci BEFORE copying the rest of the source code in a Dockerfile?",
          options: [
            "So Docker can reuse the cached dependency layer whenever source code changes but package.json has not changed",
            "Because COPY . . deletes package.json",
            "Because npm ci only works on empty directories",
            "To make the image larger",
          ],
          correctIndex: 0,
          explanation: "Docker invalidates a layer and all subsequent layers when files copied in that step change; isolating package.json saves minutes per build.",
        },
        {
          question: "What is the primary benefit of a Multi-Stage Dockerfile?",
          options: [
            "It strips out compilers, build tools, and devDependencies from the final runtime image, shrinking size and attack surface",
            "It runs multiple operating systems simultaneously",
            "It replaces Kubernetes",
            "It automatically writes unit tests",
          ],
          correctIndex: 0,
          explanation: "Only the compiled artifacts from the builder stage are copied into the lean production runner stage.",
        },
        {
          question: "Why should production containers specify a non-root USER (e.g., USER node)?",
          options: [
            "To prevent privilege escalation to host root if an attacker exploits a vulnerability inside the container",
            "Because root cannot open port 3000",
            "To increase CPU clock speed",
            "Because Docker Compose requires it",
          ],
          correctIndex: 0,
          explanation: "Running as UID 0 (root) inside a container increases the blast radius of kernel or runtime escape vulnerabilities.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "cloud-m4",
      title: "Kubernetes (K8s) Cluster Orchestration, Helm & Auto-Scaling",
      durationHours: "40 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Deploy self-healing workloads on Kubernetes using Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, and Horizontal Pod Autoscalers (HPA).",
      keyConcepts: [
        "Control Plane (API Server, etcd, Scheduler, Controller Manager) vs. Worker Nodes (kubelet, kube-proxy)",
        "Declarative Reconciliation Loop: Desired State vs. Actual State",
        "Liveness Probes (auto-restart deadlocks) vs. Readiness Probes (gate traffic until warm)",
        "Zero-Downtime Rolling Updates & Horizontal Pod Autoscaler (HPA)",
      ],
      lessonNotes: `Kubernetes orchestrates containers across a fleet of machines:
- Readiness Probe: Tells the Service Load Balancer whether a Pod is ready to accept traffic. If a Pod is still warming up its DB pool, failing Readiness removes it from the Service endpoints without killing it.
- Liveness Probe: Tells kubelet whether the process is deadlocked. Failing Liveness restarts the container.
- Resource Requests & Limits: Always define CPU/memory requests (for scheduling) and limits (to prevent a noisy neighbor from OOM-killing the node).`,
      codeOrCaseExample: {
        title: "Production Kubernetes Deployment Manifest with Probes & Limits",
        language: "yaml",
        snippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: recruits-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  template:
    spec:
      containers:
        - name: api
          image: registry.recruits.org.in/api:v2.4.0
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /healthz
              port: 3000`,
        explanation: "Setting maxUnavailable: 0 and maxSurge: 1 with a readinessProbe guarantees zero dropped requests during rolling deployments.",
      },
      handsOnLab: {
        title: "Write a Horizontal Pod Autoscaler (HPA) Replica Calculator",
        taskDescription: "Implement the Kubernetes HPA scaling formula: desiredReplicas = ceil(currentReplicas * (currentMetricValue / desiredMetricValue)), clamped between min and max replicas.",
        starterTemplate: `export function computeHpaReplicas(
  currentReplicas: number,
  currentCpuPercent: number,
  targetCpuPercent = 70,
  minReplicas = 2,
  maxReplicas = 15
): number {
  const raw = Math.ceil(currentReplicas * (currentCpuPercent / targetCpuPercent));
  return Math.max(minReplicas, Math.min(maxReplicas, raw));
}`,
        deliverableCriteria: "Implements the official Kubernetes HPA ratio formula and enforces minReplicas and maxReplicas bounds.",
      },
      quizQuestions: [
        {
          question: "In Kubernetes, what is the difference between a Readiness Probe and a Liveness Probe?",
          options: [
            "Readiness controls whether traffic is routed to the Pod; Liveness restarts the container if it is deadlocked",
            "Readiness deletes the node; Liveness upgrades the cluster",
            "They are identical",
            "Liveness only runs during docker build",
          ],
          correctIndex: 0,
          explanation: "Readiness protects users from hitting uninitialized pods; Liveness recovers stuck processes by restarting the container.",
        },
        {
          question: "Where does the Kubernetes Control Plane store all cluster state and configuration data?",
          options: [
            "etcd (distributed, consistent key-value store)",
            "Local browser cookies",
            "kube-proxy",
            "Docker Hub",
          ],
          correctIndex: 0,
          explanation: "etcd is the single source of truth backing the Kubernetes API server.",
        },
        {
          question: "Which RollingUpdate settings guarantee that active capacity never drops below 100% during a deployment?",
          options: [
            "maxUnavailable: 0 and maxSurge: 1 (with a valid readinessProbe)",
            "maxUnavailable: 100% and maxSurge: 0",
            "Recreate strategy",
            "replicas: 0",
          ],
          correctIndex: 0,
          explanation: "maxUnavailable: 0 ensures old pods are terminated only after new surge pods pass their readinessProbe.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "cloud-m5",
      title: "CI/CD Pipelines (GitHub Actions), Terraform IaC & SRE Observability",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Provision repeatable cloud infrastructure with Terraform, automate Blue/Green & Canary deployments, and monitor Golden Signals with Prometheus & Grafana.",
      keyConcepts: [
        "Infrastructure as Code (Terraform): Providers, State Locking (S3 + DynamoDB / GCS), Plan & Apply",
        "Immutable Infrastructure & Drift Detection",
        "Deployment Strategies: Rolling, Blue/Green, and Canary with automated rollback",
        "Google SRE 4 Golden Signals: Latency, Traffic, Errors, and Saturation",
      ],
      lessonNotes: `Site Reliability Engineering (SRE) replaces manual click-ops with version-controlled Infrastructure as Code (Terraform) and automated observability:
- Terraform State Locking prevents two engineers or CI pipelines from corrupting cloud resources simultaneously.
- The 4 Golden Signals (Latency, Traffic, Errors, Saturation) measure real user health; always alert on p95/p99 tail latency rather than averages.`,
      codeOrCaseExample: {
        title: "Automated Canary Deployment Rollback Evaluator",
        language: "typescript",
        snippet: `export function evaluateCanaryHealth(canaryErrorRatePercent: number, p99LatencyMs: number) {
  const maxAllowedErrorRate = 1.0; // 1%
  const maxAllowedP99Ms = 600;
  if (canaryErrorRatePercent > maxAllowedErrorRate || p99LatencyMs > maxAllowedP99Ms) {
    return { decision: "ROLLBACK_IMMEDIATELY", promoteTrafficPercent: 0 };
  }
  return { decision: "PROMOTE_CANARY", promoteTrafficPercent: 100 };
}`,
        explanation: "Canary releases route 5% of live traffic to the new version and automatically roll back if error rate or p99 latency breaches SLOs.",
      },
      handsOnLab: {
        title: "Build an SRE Error Budget Burn Rate Calculator",
        taskDescription: "Given an SLO of 99.9% and total monthly requests, calculate the total allowed failed requests (Error Budget) and remaining budget percentage.",
        starterTemplate: `export function calculateErrorBudget(totalRequests: number, failedRequests: number, sloPercent = 99.9) {
  const allowedFailures = Math.floor(totalRequests * ((100 - sloPercent) / 100));
  const remainingFailures = Math.max(0, allowedFailures - failedRequests);
  const remainingBudgetPercent = allowedFailures > 0 ? (remainingFailures / allowedFailures) * 100 : 0;
  return { allowedFailures, remainingFailures, remainingBudgetPercent: Number(remainingBudgetPercent.toFixed(1)) };
}`,
        deliverableCriteria: "Computes allowed error budget from SLO and tracks remaining error budget percentage.",
      },
      quizQuestions: [
        {
          question: "What are the 4 Golden Signals of SRE monitoring defined by Google?",
          options: [
            "Latency, Traffic, Errors, and Saturation",
            "HTML, CSS, JS, and SQL",
            "Keyboard, Mouse, Monitor, and Printer",
            "agile, scrum, kanban, and waterfall",
          ],
          correctIndex: 0,
          explanation: "Monitoring Latency, Traffic, Errors, and Saturation captures user-facing reliability and capacity bottlenecks.",
        },
        {
          question: "Why must Terraform remote state use State Locking in team environments?",
          options: [
            "To prevent concurrent 'terraform apply' runs from corrupting state and causing conflicting cloud mutations",
            "To make Terraform files unreadable",
            "To delete cloud resources every night",
            "To bypass cloud billing",
          ],
          correctIndex: 0,
          explanation: "State locking ensures only one process modifies the infrastructure state at any given moment.",
        },
        {
          question: "Why do SREs monitor p95 and p99 tail latency instead of simple average (mean) latency?",
          options: [
            "Averages hide severe slowdowns experienced by the slowest 1%–5% of requests (often high-value checkout/database calls)",
            "Averages are impossible to calculate",
            "p99 is always smaller than the mean",
            "Prometheus cannot compute averages",
          ],
          correctIndex: 0,
          explanation: "If 99% of requests take 10ms and 1% time out at 30,000ms, the average looks fast (~309ms) while 1 in 100 users suffers a broken experience.",
        },
      ],
    },
  ],

  "prog-05-big-data": [
    {
      moduleNumber: 1,
      id: "bigdata-m1",
      title: "Advanced Analytical SQL, Dimensional Modeling & Columnar Storage",
      durationHours: "32 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Write high-performance Window Functions, CTEs, Star/Snowflake schemas, and master Parquet/ORC columnar storage internals.",
      keyConcepts: [
        "OLTP (Row-oriented: Postgres/MySQL) vs. OLAP (Columnar: Parquet, BigQuery, Snowflake)",
        "SQL Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD() & rolling frames",
        "Star Schema (Fact tables + Dimension tables) & Slowly Changing Dimensions (SCD Type 2)",
        "Partitioning (by date) vs. Clustering/Bucketing (by high-cardinality keys)",
      ],
      lessonNotes: `In Big Data Analytics, scanning all columns of a 10TB row-oriented table is prohibitively slow and expensive.
Columnar formats (Apache Parquet) store values of each column contiguously using Run-Length Encoding (RLE) and Dictionary Compression, allowing engines to read ONLY the 3 columns requested by a query and skip entire row groups via min/max predicate pushdown.`,
      codeOrCaseExample: {
        title: "Analytical SQL Window Function: Top Salaries & Month-over-Month Growth",
        language: "sql",
        snippet: `WITH DepartmentRanks AS (
  SELECT
    employee_id,
    department,
    salary_lpa,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary_lpa DESC) AS dept_rank,
    AVG(salary_lpa) OVER (PARTITION BY department) AS dept_avg_lpa
  FROM enterprise_employees
)
SELECT *
FROM DepartmentRanks
WHERE dept_rank <= 3;`,
        explanation: "DENSE_RANK() OVER (PARTITION BY ...) ranks rows within each department without collapsing rows or skipping rank numbers on ties.",
      },
      handsOnLab: {
        title: "Simulate SCD Type 2 Historical Record Versioning",
        taskDescription: "Write a function that expires an existing active dimension record (setting is_current = false and valid_to) and inserts a new active version when an attribute changes.",
        starterTemplate: `export function applyScdType2Update(currentRecord: { id: string; city: string; version: number }, newCity: string, nowIso: string) {
  const expiredOld = { ...currentRecord, is_current: false, valid_to: nowIso };
  const activeNew = { id: currentRecord.id, city: newCity, version: currentRecord.version + 1, is_current: true, valid_from: nowIso, valid_to: null };
  return [expiredOld, activeNew];
}`,
        deliverableCriteria: "Preserves full historical audit trail by closing the old row and opening a new current row.",
      },
      quizQuestions: [
        {
          question: "Why is Apache Parquet (columnar format) vastly faster than CSV for analytical OLAP queries?",
          options: [
            "It reads only the queried columns (projection pushdown), skips irrelevant row groups via min/max stats, and compresses homogeneous column types",
            "It stores data as unindexed plain text",
            "It only supports 100 rows",
            "It requires no disk space",
          ],
          correctIndex: 0,
          explanation: "Columnar storage minimizes I/O by reading only needed columns and leveraging per-column compression and statistics.",
        },
        {
          question: "What is the difference between RANK() and DENSE_RANK() in SQL Window Functions when two rows tie for 1st place?",
          options: [
            "RANK() assigns 1, 1, 3 (skips 2); DENSE_RANK() assigns 1, 1, 2 (no gaps)",
            "RANK() deletes tied rows",
            "DENSE_RANK() sorts in random order",
            "They produce identical numbers",
          ],
          correctIndex: 0,
          explanation: "DENSE_RANK() produces consecutive rank integers without gaps after ties.",
        },
        {
          question: "How does a Slowly Changing Dimension (SCD) Type 2 preserve historical accuracy when a customer changes their city?",
          options: [
            "It marks the old row as expired (valid_to timestamp, is_current = false) and inserts a new active row with the updated city",
            "It overwrites the old city and destroys history (SCD Type 1)",
            "It deletes the customer",
            "It creates a new database server",
          ],
          correctIndex: 0,
          explanation: "SCD Type 2 maintains full historical point-in-time reporting by versioning dimension rows.",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "bigdata-m2",
      title: "Distributed Data Processing with Apache Spark & PySpark",
      durationHours: "40 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Optimize terabyte-scale PySpark jobs using Lazy Evaluation, Catalyst Optimizer, Broadcast Joins, and Data Skew salting.",
      keyConcepts: [
        "Spark Architecture: Driver, Cluster Manager, Executors, Partitions & DAG Scheduler",
        "Narrow Transformations (map, filter — zero shuffle) vs. Wide Transformations (groupBy, join — network shuffle)",
        "Broadcast Hash Join vs. Sort-Merge Join for eliminating massive shuffles",
        "Handling Data Skew via key salting & Adaptive Query Execution (AQE)",
      ],
      lessonNotes: `In Apache Spark, transformations (filter, select, join) are lazily evaluated—Spark builds a Directed Acyclic Graph (DAG) and optimizes the physical plan via the Catalyst Optimizer only when an Action (count, write, collect) is called.
The #1 performance killer in Spark is the Network Shuffle caused by wide transformations. When joining a 500GB fact table with a 20MB dimension table, always use a Broadcast Join (\`broadcast(dim_df)\`) so the small table is sent to each executor in memory without shuffling the 500GB table!`,
      codeOrCaseExample: {
        title: "PySpark Broadcast Join & Aggregation Pipeline",
        language: "python",
        snippet: `from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = SparkSession.builder.appName("RecruitsBigDataAnalytics").getOrCreate()

# Large 100M row job applications fact table + small sector lookup dimension
apps_df = spark.read.parquet("s3a://recruits-lake/applications/")
sectors_df = spark.read.parquet("s3a://recruits-lake/dim_sectors/")

# Broadcast small dimension table to avoid shuffling 100M fact rows
result_df = (
    apps_df.join(F.broadcast(sectors_df), on="sector_id", how="inner")
    .groupBy("sector_name")
    .agg(
        F.count("app_id").alias("total_applications"),
        F.avg("ats_score").alias("avg_ats_score")
    )
)`,
        explanation: "F.broadcast(sectors_df) replicates the small dimension table to every worker node, turning an expensive Sort-Merge shuffle into a fast local hash lookup.",
      },
      handsOnLab: {
        title: "Choose Optimal Join Strategy Based on Table Size",
        taskDescription: "Write a query planner rule that selects BROADCAST_HASH_JOIN when the smaller table is <= 50MB and SORT_MERGE_JOIN otherwise.",
        starterTemplate: `export function selectSparkJoinStrategy(leftTableSizeMB: number, rightTableSizeMB: number, broadcastThresholdMB = 50) {
  const smallerMB = Math.min(leftTableSizeMB, rightTableSizeMB);
  if (smallerMB <= broadcastThresholdMB) {
    return { strategy: "BROADCAST_HASH_JOIN", requiresFullShuffle: false };
  }
  return { strategy: "SORT_MERGE_JOIN", requiresFullShuffle: true };
}`,
        deliverableCriteria: "Chooses broadcast join below the threshold and flags whether a full network shuffle is required.",
      },
      quizQuestions: [
        {
          question: "In Apache Spark, what is the difference between a Narrow Transformation (e.g., filter) and a Wide Transformation (e.g., groupBy)?",
          options: [
            "Narrow transformations process each partition independently in memory; Wide transformations require shuffling data across the network between executors",
            "Narrow transformations only work on strings",
            "Wide transformations run only on the Driver node",
            "There is no difference",
          ],
          correctIndex: 0,
          explanation: "Wide transformations cross stage boundaries because records with the same key must be shuffled across nodes.",
        },
        {
          question: "Why should you avoid calling df.collect() on a large 500GB Spark DataFrame?",
          options: [
            "It pulls all 500GB of distributed partition data onto the single Driver node's memory, causing an OutOfMemoryError crash",
            "It deletes the S3 bucket",
            "It converts Parquet to CSV",
            "It restarts the cluster",
          ],
          correctIndex: 0,
          explanation: "collect() transfers the entire dataset to the Driver process; use take(n) or write directly to distributed storage instead.",
        },
        {
          question: "When joining a 1TB fact table with a 15MB lookup table in Spark, which optimization avoids shuffling the 1TB table?",
          options: [
            "Broadcast Hash Join (broadcasting the 15MB table to all executors)",
            "Cartesian Cross Join",
            "Repartitioning into 1 partition",
            "Converting to Pandas on the driver",
          ],
          correctIndex: 0,
          explanation: "Broadcasting the small table allows each executor to join its local partition of the 1TB table without network shuffles.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "bigdata-m3",
      title: "Real-Time Event Streaming with Apache Kafka & Stream Processing",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Architect high-throughput event streaming pipelines using Kafka Topics, Partitions, Consumer Groups, Offset Management, and Tumbling/Sliding Windows.",
      keyConcepts: [
        "Kafka Internals: Brokers, Topics, Partitions, Leader/Follower ISR Replication",
        "Consumer Groups: Partition assignment & horizontal parallelism limits",
        "Delivery Semantics: At-Most-Once, At-Least-Once & Exactly-Once (Idempotent Producers)",
        "Event-Time vs. Processing-Time & Watermarks for late-arriving data",
      ],
      lessonNotes: `Apache Kafka is the central nervous system of modern real-time data architectures:
- Ordering Guarantee: Kafka guarantees strict message ordering WITHIN a single partition (not across an entire multi-partition topic). To keep all events for a specific user_id or order_id in exact sequence, use user_id as the message Partition Key!
- Consumer Group Parallelism: Within a single Consumer Group, each partition is consumed by at most ONE consumer thread. Having more consumers in a group than partitions leaves extra consumers idle.`,
      codeOrCaseExample: {
        title: "Deterministic Kafka Partition Key Router",
        language: "typescript",
        snippet: `export function routeEventToPartition(entityKey: string, numPartitions: number): number {
  let hash = 0;
  for (let i = 0; i < entityKey.length; i++) {
    hash = (hash * 31 + entityKey.charCodeAt(i)) >>> 0;
  }
  return hash % numPartitions;
}`,
        explanation: "Hashing the entityKey modulo numPartitions ensures all events for the same user or order land in the exact same partition in strict chronological order.",
      },
      handsOnLab: {
        title: "Build an Idempotent Stream Deduplicator for At-Least-Once Pipelines",
        taskDescription: "Write a stream processor helper that deduplicates incoming Kafka events by event_id so retries never double-count financial transactions.",
        starterTemplate: `export function deduplicateStreamEvents<T extends { eventId: string }>(events: T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const ev of events) {
    if (!seen.has(ev.eventId)) {
      seen.add(ev.eventId);
      unique.push(ev);
    }
  }
  return unique;
}`,
        deliverableCriteria: "Filters out duplicate eventIds while preserving original arrival order.",
      },
      quizQuestions: [
        {
          question: "If a Kafka topic has 6 partitions and a Consumer Group has 8 consumer instances, how many consumers in that group will actively receive messages?",
          options: [
            "6 consumers will be active (1 per partition) and 2 consumers will sit idle as warm standbys",
            "All 8 consumers will read from all 6 partitions simultaneously",
            "The Kafka broker will crash",
            "Only 1 consumer will work",
          ],
          correctIndex: 0,
          explanation: "In Kafka, a partition can be assigned to only one consumer within the same Consumer Group at a time.",
        },
        {
          question: "How do you guarantee that all status updates for 'Order-9921' are processed in strict chronological order in Kafka?",
          options: [
            "Publish all events for 'Order-9921' using 'Order-9921' as the Partition Key so they hash to the same partition",
            "Use random partition keys",
            "Delete consumer offsets",
            "Set replication factor to 0",
          ],
          correctIndex: 0,
          explanation: "Kafka guarantees strict offset ordering within a single partition; keying by order_id routes all related events to the same partition.",
        },
        {
          question: "What is the purpose of a 'Watermark' in stateful stream processing?",
          options: [
            "To bound how long the streaming engine waits for late-arriving out-of-order event-time records before closing a time window",
            "To add a visual logo to PDF reports",
            "To cool down server CPUs",
            "To encrypt Kafka brokers",
          ],
          correctIndex: 0,
          explanation: "Watermarks track event-time progress and allow the engine to safely finalize windowed aggregations despite network delays.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "bigdata-m4",
      title: "Modern Cloud Data Warehousing & Lakehouses (Snowflake, BigQuery & Delta Lake)",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Implement Medallion Architecture (Bronze -> Silver -> Gold), ACID transactions on object storage (Delta Lake / Iceberg), and separation of compute & storage.",
      keyConcepts: [
        "Decoupled Storage & Compute in Snowflake and Google BigQuery",
        "Medallion Lakehouse Architecture: Bronze (Raw), Silver (Cleaned/Conformed), Gold (Business Aggregates)",
        "Open Table Formats: Delta Lake & Apache Iceberg (ACID transactions, Time Travel, Schema Evolution)",
        "Cost Control: Partition pruning, Clustering keys & Materialized Views",
      ],
      lessonNotes: `The Medallion Lakehouse Architecture unifies the low cost of Cloud Object Storage with the ACID reliability of Data Warehouses:
1. Bronze Layer: Append-only raw ingestion (JSON/Parquet) preserving exact source payloads for replayability.
2. Silver Layer: Deduplicated, schema-enforced, PII-masked enterprise tables joined via Delta Lake / Iceberg MERGE (Upsert).
3. Gold Layer: Star-schema dimensional marts and executive KPI aggregates powering BI dashboards and ML feature stores.`,
      codeOrCaseExample: {
        title: "Delta Lake / Iceberg Idempotent MERGE (Upsert) Pattern",
        language: "sql",
        snippet: `MERGE INTO silver_Zone.candidate_profiles AS target
USING bronze_zone.staged_candidate_events AS source
ON target.candidate_id = source.candidate_id
WHEN MATCHED AND source.updated_at > target.updated_at THEN
  UPDATE SET
    target.skills = source.skills,
    target.career_score = source.career_score,
    target.updated_at = source.updated_at
WHEN NOT MATCHED THEN
  INSERT (candidate_id, skills, career_score, updated_at)
  VALUES (source.candidate_id, source.skills, source.career_score, source.updated_at);`,
        explanation: "MERGE INTO atomically updates existing records and inserts new records in a single ACID transaction, making pipelines safely re-runnable.",
      },
      handsOnLab: {
        title: "Implement a Bronze-to-Silver Data Quality Gate",
        taskDescription: "Write a Medallion pipeline quality gate that separates raw Bronze records into valid Silver records and quarantined Dead-Letter Queue (DLQ) records.",
        starterTemplate: `export function bronzeToSilverFilter(records: { id?: string; email?: string; amount?: number }[]) {
  const silver: typeof records = [];
  const quarantineDlq: typeof records = [];
  for (const r of records) {
    if (r.id && r.email?.includes("@") && typeof r.amount === "number" && r.amount >= 0) {
      silver.push(r);
    } else {
      quarantineDlq.push(r);
    }
  }
  return { silverCount: silver.length, dlqCount: quarantineDlq.length, silver, quarantineDlq };
}`,
        deliverableCriteria: "Routes valid records to Silver and isolates corrupt/incomplete records into a Quarantine DLQ without crashing the pipeline.",
      },
      quizQuestions: [
        {
          question: "In the Medallion Lakehouse Architecture, what is the role of the Bronze, Silver, and Gold layers?",
          options: [
            "Bronze = Raw immutable ingestion; Silver = Cleaned, deduplicated & conformed tables; Gold = Business-ready aggregates & BI marts",
            "Bronze = Deleted data; Silver = Temporary cache; Gold = Raw logs",
            "They represent subscription pricing tiers",
            "They are CPU hardware models",
          ],
          correctIndex: 0,
          explanation: "Medallion architecture progressively refines data quality from raw landing (Bronze) to validated enterprise entities (Silver) to analytics marts (Gold).",
        },
        {
          question: "What capability do Open Table Formats like Delta Lake and Apache Iceberg add on top of raw Parquet files in S3/GCS?",
          options: [
            "ACID transactions, atomic MERGE upserts, Time Travel versioning, and schema evolution via transaction logs",
            "They convert Parquet into Word documents",
            "They remove the need for cloud storage",
            "They only work on local floppy disks",
          ],
          correctIndex: 0,
          explanation: "Delta Lake and Iceberg maintain metadata transaction logs over Parquet files, enabling concurrent ACID reads/writes and time travel.",
        },
        {
          question: "How do you minimize query cost in Google BigQuery when querying a 50TB event table?",
          options: [
            "Select only required columns (never SELECT *) and filter on the Partition Date and Clustered columns",
            "Use SELECT * without a WHERE clause",
            "Disable table partitioning",
            "Export the table to CSV on every query",
          ],
          correctIndex: 0,
          explanation: "BigQuery charges per byte scanned; column selection + partition/cluster pruning drastically reduces bytes read.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "bigdata-m5",
      title: "Workflow Orchestration with Apache Airflow, dbt & Lakehouse Capstone",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Author idempotent Apache Airflow DAGs, modular SQL transformations with dbt, automated data quality tests, and SLA alerting.",
      keyConcepts: [
        "Apache Airflow DAGs: Operators, Sensors, Task Dependencies & Cron Schedules",
        "Pipeline Idempotency & Backfill safety using logical execution dates",
        "dbt (data build tool): Modular SQL models, lineage graphs, and schema tests (unique, not_null, relationships)",
        "Data Observability: Freshness, Volume, Schema & Distribution anomaly detection",
      ],
      lessonNotes: `The golden rule of Data Engineering orchestration is Idempotency: running the same pipeline task for \`2026-11-17\` once, twice, or ten times must produce the exact same target table state without duplicating rows.
Achieve idempotency by:
- Using \`INSERT OVERWRITE PARTITION (dt = '{{ ds }}')\` or \`MERGE INTO\` keyed on primary IDs, rather than blind \`INSERT INTO\` appends.`,
      codeOrCaseExample: {
        title: "Apache Airflow Idempotent Daily Lakehouse DAG",
        language: "python",
        snippet: `from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    "owner": "recruits_data_eng",
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="daily_placement_lakehouse_etl",
    default_args=default_args,
    schedule_interval="0 2 * * *",
    start_date=datetime(2026, 1, 1),
    catchup=False,
) as dag:
    ingest_bronze = PythonOperator(task_id="ingest_bronze", python_callable=lambda: print("Bronze ingested"))
    transform_silver = PythonOperator(task_id="transform_silver", python_callable=lambda: print("Silver merged"))
    build_gold_kpis = PythonOperator(task_id="build_gold_kpis", python_callable=lambda: print("Gold ready"))

    ingest_bronze >> transform_silver >> build_gold_kpis`,
        explanation: "The >> bitshift operator defines strict upstream-to-downstream task dependencies in the Directed Acyclic Graph.",
      },
      handsOnLab: {
        title: "Write a dbt-Style Data Quality Assertion Runner",
        taskDescription: "Implement a data quality validator that checks a table for primary key uniqueness and non-null constraints before promoting to Gold.",
        starterTemplate: `export function runDbtQualityTests(rows: { id: string | null; amount: number | null }[]) {
  const seenIds = new Set<string>();
  let nullViolations = 0;
  let duplicateViolations = 0;
  for (const r of rows) {
    if (!r.id || r.amount === null) nullViolations++;
    else if (seenIds.has(r.id)) duplicateViolations++;
    else seenIds.add(r.id);
  }
  return { passed: nullViolations === 0 && duplicateViolations === 0, nullViolations, duplicateViolations };
}`,
        deliverableCriteria: "Detects both null primary keys/metrics and duplicate primary keys, halting promotion if violations > 0.",
      },
      quizQuestions: [
        {
          question: "What does it mean for an Airflow ETL task to be 'Idempotent'?",
          options: [
            "Re-running the task multiple times for the same date partition produces the exact same target data without duplicate rows",
            "The task can only be run once in history",
            "The task ignores all errors",
            "The task runs without a schedule",
          ],
          correctIndex: 0,
          explanation: "Idempotency guarantees safe retries and historical backfills without corrupting or double-counting warehouse data.",
        },
        {
          question: "Why can an Airflow DAG (Directed Acyclic Graph) NEVER contain a circular dependency loop (A -> B -> A)?",
          options: [
            "Because a cycle creates a deadlock where neither task can ever satisfy its upstream prerequisite to start",
            "Because Python does not support loops",
            "Because SQL tables cannot have more than 2 columns",
            "Because cron only runs on Sundays",
          ],
          correctIndex: 0,
          explanation: "Acyclic means no circular loops; a cycle prevents topological sorting and deadlocks workflow execution.",
        },
        {
          question: "In dbt (data build tool), what do the built-in schema tests 'unique' and 'not_null' protect against?",
          options: [
            "Duplicate primary keys (fan-out join bugs) and missing critical identifier values before dashboards consume the table",
            "Slow internet connections",
            "CSS styling bugs",
            "Expired SSL certificates",
          ],
          correctIndex: 0,
          explanation: "Running unique and not_null assertions on every build catches silent upstream data corruption early.",
        },
      ],
    },
  ],

  "prog-06-digital-marketing": [
    {
      moduleNumber: 1,
      id: "dm-m1",
      title: "Growth Marketing Foundations, Full-Funnel Strategy & Unit Economics",
      durationHours: "24 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master the AARRR Pirate Funnel (Acquisition, Activation, Retention, Referral, Revenue), Customer Acquisition Cost (CAC), LTV:CAC ratio, and payback periods.",
      keyConcepts: [
        "AARRR Growth Funnel stages & North Star Metric selection",
        "Unit Economics: CAC (Customer Acquisition Cost), LTV (Lifetime Value) & LTV:CAC >= 3:1 benchmark",
        "Ideal Customer Profile (ICP), Buyer Personas & Value Proposition Canvas",
        "Cohort Retention curves & churn impact on compounding growth",
      ],
      lessonNotes: `Sustainable growth is governed by unit economics:
- CAC = (Total Marketing + Sales Spend) / Number of New Customers Acquired.
- LTV = (Average Order Value * Purchase Frequency * Gross Margin %) / Churn Rate.
In healthy SaaS, EdTech, and E-commerce businesses, the **LTV:CAC ratio should be >= 3:1**, and the CAC Payback Period should be under 12 months.`,
      codeOrCaseExample: {
        title: "Growth Unit Economics & LTV:CAC Health Analyzer",
        language: "typescript",
        snippet: `export function analyzeUnitEconomics(adSpendINR: number, newCustomers: number, arpuMonthlyINR: number, grossMarginPct: number, monthlyChurnPct: number) {
  const cac = adSpendINR / Math.max(1, newCustomers);
  const ltv = (arpuMonthlyINR * (grossMarginPct / 100)) / Math.max(0.001, monthlyChurnPct / 100);
  const ltvToCac = ltv / Math.max(1, cac);
  return {
    cacINR: Math.round(cac),
    ltvINR: Math.round(ltv),
    ltvToCacRatio: Number(ltvToCac.toFixed(2)),
    verdict: ltvToCac >= 3 ? "Healthy Scalable Growth (>= 3:1)" : "Optimize Funnel / Reduce CAC"
  };
}`,
        explanation: "Tracking LTV:CAC ensures paid acquisition scales profitably rather than burning capital on low-retention users.",
      },
      handsOnLab: {
        title: "Calculate Funnel Conversion Rate & Revenue Lift",
        taskDescription: "Given 50,000 visitors, a 4% lead conversion rate, and a 12% lead-to-customer close rate at ₹15,000 AOV, compute total customers and revenue.",
        starterTemplate: `export function simulateGrowthFunnel(visitors: number, leadConvPct: number, closeConvPct: number, aovINR: number) {
  const leads = Math.round(visitors * (leadConvPct / 100));
  const customers = Math.round(leads * (closeConvPct / 100));
  const revenueINR = customers * aovINR;
  return { leads, customers, revenueINR };
}`,
        deliverableCriteria: "Computes stage-by-stage funnel conversion volume and total gross revenue.",
      },
      quizQuestions: [
        {
          question: "What is the industry benchmark LTV:CAC (Lifetime Value to Customer Acquisition Cost) ratio for a healthy, scalable digital business?",
          options: [
            "3:1 or higher (LTV is at least 3x CAC)",
            "0.2:1 (spending 5x more to acquire a customer than they ever pay)",
            "1:1 before gross margin",
            "CAC does not matter in marketing",
          ],
          correctIndex: 0,
          explanation: "An LTV:CAC ratio of >= 3:1 leaves sufficient margin for R&D, operations, and profitable reinvestment.",
        },
        {
          question: "What do the 5 stages of the AARRR Pirate Growth Funnel stand for?",
          options: [
            "Acquisition, Activation, Retention, Referral, Revenue",
            "Advertising, Accounting, Recruiting, Reporting, Retiring",
            "Analytics, Algorithms, Arrays, Routers, Registers",
            "Audio, Animation, Rendering, Resolution, Refresh",
          ],
          correctIndex: 0,
          explanation: "Dave McClure's AARRR framework maps the complete customer lifecycle from first touch to advocacy and monetization.",
        },
        {
          question: "Why is 'Retention' the most powerful multiplier in growth marketing?",
          options: [
            "Reducing churn increases Customer Lifetime Value (LTV) and compounds word-of-mouth referrals, allowing higher paid CAC bids",
            "Retention only affects website font choices",
            "Retained customers never buy again",
            "Search engines penalize high retention",
          ],
          correctIndex: 0,
          explanation: "A leaky bucket wastes acquisition spend; strong retention compounds cohorts and increases LTV.",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "dm-m2",
      title: "Technical SEO, Programmatic SEO & AI-Powered Content Engines",
      durationHours: "24 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Dominate organic search rankings through Core Web Vitals, Schema.org JSON-LD structured data, topic clustering, and programmatic landing pages.",
      keyConcepts: [
        "Technical SEO: Crawlability (robots.txt, XML Sitemaps), Canonical tags & Core Web Vitals (LCP, INP, CLS)",
        "Keyword Intent Mapping: Informational, Navigational, Commercial Investigation & Transactional",
        "Programmatic SEO: Scaling thousands of high-intent pages (e.g., 'Jobs in [City] for [Skill]')",
        "Schema.org JSON-LD (JobPosting, Course, FAQPage) for Google Rich Results",
      ],
      lessonNotes: `Programmatic SEO powers the world's largest portals (Recruits.org.in, Naukri, Zillow, TripAdvisor).
Instead of writing one generic blog post at a time, you combine a structured database (e.g., 30 Odisha districts x 50 job categories = 1,500 high-intent pages) with rich value-add data (live vacancies, salary ranges, JSON-LD JobPosting schema) so Google indexes and ranks every long-tail search query automatically.`,
      codeOrCaseExample: {
        title: "Schema.org Course & JobPosting JSON-LD Generator for Rich Snippets",
        language: "typescript",
        snippet: `export function buildCourseJsonLd(courseTitle: string, feeINR: number, providerUrl = "https://recruits.org.in") {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseTitle,
    provider: {
      "@type": "Organization",
      name: "Recruits.org.in (Quench Research Labs Private Limited)",
      sameAs: providerUrl
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: feeINR
    }
  };
}`,
        explanation: "Embedding Schema.org JSON-LD allows Google Search and AI Overviews to display rich cards with pricing and provider badges.",
      },
      handsOnLab: {
        title: "Build an On-Page SEO Meta & Keyword Density Auditor",
        taskDescription: "Write an SEO checker that verifies title length (30-60 chars), meta description length (110-160 chars), and target keyword presence.",
        starterTemplate: `export function auditPageSeo(title: string, metaDesc: string, targetKeyword: string) {
  const kw = targetKeyword.toLowerCase();
  const titleOptimal = title.length >= 30 && title.length <= 65 && title.toLowerCase().includes(kw);
  const descOptimal = metaDesc.length >= 100 && metaDesc.length <= 165 && metaDesc.toLowerCase().includes(kw);
  return { score: (titleOptimal ? 50 : 20) + (descOptimal ? 50 : 20), titleOptimal, descOptimal };
}`,
        deliverableCriteria: "Validates character length bounds and keyword inclusion in both title and meta description.",
      },
      quizQuestions: [
        {
          question: "What is the purpose of `<link rel='canonical' href='...' />` in Technical SEO?",
          options: [
            "To tell search engines which URL is the master authoritative version when duplicate or filter-parameter URLs exist, consolidating ranking equity",
            "To block all users from visiting the website",
            "To change the background color of the page",
            "To disable HTTPS",
          ],
          correctIndex: 0,
          explanation: "Canonical tags prevent duplicate content dilution across query parameters (e.g., ?utm_source=... or ?sort=price).",
        },
        {
          question: "Which Schema.org structured data format is officially recommended by Google for rich search snippets?",
          options: [
            "JSON-LD (<script type='application/ld+json'>)",
            "Plain CSV tables",
            "Flash SWF objects",
            "Inline CSS comments",
          ],
          correctIndex: 0,
          explanation: "JSON-LD cleanly separates structured semantic metadata from visual HTML markup.",
        },
        {
          question: "Which user search query demonstrates high 'Transactional / Commercial' intent rather than purely informational intent?",
          options: [
            "'Enroll in Data Science course with placement in Bhubaneswar'",
            "'What is the history of computers?'",
            "'Who invented Python?'",
            "'Weather today'",
          ],
          correctIndex: 0,
          explanation: "Transactional queries signal immediate readiness to enroll, purchase, or apply.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "dm-m3",
      title: "Paid Performance Marketing (Google Search/PMax, Meta Ads & LinkedIn B2B)",
      durationHours: "26 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Run high-ROAS paid campaigns mastering Ad Rank, Quality Score, Pixel/Conversions API (CAPI) tracking, Lookalike audiences, and creative A/B testing.",
      keyConcepts: [
        "Google Ads Auction: Ad Rank = Max CPC Bid x Quality Score (Expected CTR + Ad Relevance + Landing Page UX)",
        "ROAS (Return on Ad Spend), CPA (Cost Per Acquisition), CTR & CPM",
        "Server-Side Conversions API (CAPI) + Browser Pixel for cookieless attribution",
        "Creative Hook-Hold-CTA framework for Meta & YouTube video ads",
      ],
      lessonNotes: `In Google Search Ads, the highest bidder does NOT always win #1 position.
**Ad Rank = CPC Bid x Quality Score (1–10)**.
If your Quality Score is 10/10 (high expected CTR, tightly matched ad copy, fast relevant landing page) and a competitor has a Quality Score of 4/10, you can win a higher ad position while paying **less than half their Cost-Per-Click (CPC)**!`,
      codeOrCaseExample: {
        title: "Paid Campaign ROAS, CPA & Breakeven Analyzer",
        language: "typescript",
        snippet: `export function evaluateAdCampaignMetrics(spendINR: number, clicks: number, conversions: number, revenueINR: number, grossMarginPct = 60) {
  const cpc = spendINR / Math.max(1, clicks);
  const cpa = spendINR / Math.max(1, conversions);
  const roas = revenueINR / Math.max(1, spendINR);
  const breakevenRoas = 1 / (grossMarginPct / 100);
  return {
    cpcINR: Number(cpc.toFixed(2)),
    cpaINR: Math.round(cpa),
    roas: Number(roas.toFixed(2)),
    profitable: roas >= breakevenRoas
  };
}`,
        explanation: "With a 60% gross margin, Breakeven ROAS is 1 / 0.60 = 1.67x. Any campaign above 1.67x ROAS generates net contribution profit.",
      },
      handsOnLab: {
        title: "Simulate Google Ads Quality Score Impact on Actual CPC",
        taskDescription: "Calculate the actual CPC paid by an advertiser given competitor Ad Rank and the advertiser's own Quality Score: Actual CPC = (Competitor Ad Rank / Your Quality Score) + 0.01.",
        starterTemplate: `export function calculateActualCpc(competitorBid: number, competitorQs: number, yourQs: number) {
  const competitorAdRank = competitorBid * competitorQs;
  const actualCpc = competitorAdRank / Math.max(1, yourQs) + 0.01;
  return { competitorAdRank, actualCpc: Number(actualCpc.toFixed(2)) };
}`,
        deliverableCriteria: "Applies the second-price Ad Rank auction formula showing how higher Quality Score lowers CPC.",
      },
      quizQuestions: [
        {
          question: "How does improving your Google Ads Quality Score from 5 to 10 impact your Cost Per Click (CPC)?",
          options: [
            "It cuts the actual CPC required to maintain the same Ad Rank by roughly 50%",
            "It doubles your CPC",
            "Quality Score has no effect on CPC",
            "It pauses your campaign",
          ],
          correctIndex: 0,
          explanation: "Because Ad Rank = Bid x Quality Score, doubling Quality Score lets you achieve the same rank at half the bid.",
        },
        {
          question: "If a product has a 50% Gross Profit Margin, what is its minimum Breakeven ROAS (Return on Ad Spend)?",
          options: [
            "2.0x ROAS (₹200 revenue per ₹100 ad spend yields ₹100 gross profit, covering the ₹100 ad cost)",
            "0.5x ROAS",
            "10.0x ROAS",
            "1.0x ROAS",
          ],
          correctIndex: 0,
          explanation: "Breakeven ROAS = 1 / Gross Margin % = 1 / 0.50 = 2.0x.",
        },
        {
          question: "Why do modern performance marketers implement Meta/Google Server-Side Conversions API (CAPI) alongside the browser Pixel?",
          options: [
            "To preserve accurate conversion tracking and algorithmic bidding signals despite browser ad-blockers and iOS/cookie restrictions",
            "To slow down page load speed",
            "To replace the website checkout page",
            "Because browser pixels are illegal",
          ],
          correctIndex: 0,
          explanation: "Server-to-server CAPI events bypass client-side script blocking and improve Event Match Quality.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "dm-m4",
      title: "Web Analytics (GA4), Multi-Touch Attribution & Conversion Rate Optimization (CRO)",
      durationHours: "22 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Instrument event-based GA4 tracking, UTM taxonomy, Multi-Touch Attribution models, and high-velocity landing page A/B testing.",
      keyConcepts: [
        "GA4 Event-Based Data Model: Users, Sessions, Events & Custom Parameters",
        "Strict UTM Parameter Taxonomy (utm_source, utm_medium, utm_campaign, utm_content, utm_term)",
        "Attribution Models: First-Click, Last-Click, Linear, Time-Decay & Data-Driven (Shapley)",
        "CRO Framework: Heatmap diagnosis, friction removal, social proof & ICE prioritization",
      ],
      lessonNotes: `Relying solely on Last-Click Attribution starves top-of-funnel discovery channels (YouTube, Social, Content) because it gives 100% credit to the final branded search click.
Data-Driven Attribution distributes fractional conversion credit across every touchpoint that influenced the buyer's journey.`,
      codeOrCaseExample: {
        title: "Standardized Campaign UTM URL Builder & Validator",
        language: "typescript",
        snippet: `export function buildCampaignUtmUrl(baseUrl: string, params: { source: string; medium: string; campaign: string; content?: string }) {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", params.source.toLowerCase().trim());
  url.searchParams.set("utm_medium", params.medium.toLowerCase().trim());
  url.searchParams.set("utm_campaign", params.campaign.toLowerCase().replace(/\\s+/g, "_"));
  if (params.content) url.searchParams.set("utm_content", params.content.toLowerCase().trim());
  return url.toString();
}`,
        explanation: "Forcing lowercase, underscore-normalized UTM tags prevents GA4 from splitting traffic across 'LinkedIn', 'linkedin', and 'linked_in'.",
      },
      handsOnLab: {
        title: "Prioritize CRO Experiments Using the ICE Scoring Framework",
        taskDescription: "Compute the ICE score (Impact * Confidence * Ease / 3) for a list of landing page A/B test hypotheses and sort them highest first.",
        starterTemplate: `export function rankCroExperiments(ideas: { name: string; impact: number; confidence: number; ease: number }[]) {
  return ideas
    .map((item) => ({
      ...item,
      iceScore: Number(((item.impact + item.confidence + item.ease) / 3).toFixed(2))
    }))
    .sort((a, b) => b.iceScore - a.iceScore);
}`,
        deliverableCriteria: "Calculates ICE score for each hypothesis and sorts experiments in descending priority order.",
      },
      quizQuestions: [
        {
          question: "Why must UTM parameters (utm_source, utm_medium) always follow a strict lowercase naming convention?",
          options: [
            "Analytics platforms are case-sensitive, so 'Meta', 'meta', and 'META' would fragment into three separate rows in reports",
            "Uppercase URLs cannot be clicked on mobile phones",
            "HTTPS blocks uppercase letters",
            "Browsers delete uppercase query strings",
          ],
          correctIndex: 0,
          explanation: "Consistent lowercase taxonomy keeps channel grouping and attribution reports clean and unified.",
        },
        {
          question: "What is the main flaw of 'Last-Click Attribution'?",
          options: [
            "It assigns 100% of credit to the final touchpoint before purchase, undervaluing top-of-funnel awareness and consideration campaigns",
            "It gives 100% credit to the very first ad a user ever saw",
            "It requires no tracking codes",
            "It only works for offline billboards",
          ],
          correctIndex: 0,
          explanation: "Last-click ignores the discovery and nurturing touchpoints that created the demand in the first place.",
        },
        {
          question: "In Conversion Rate Optimization (CRO), what does the ICE prioritization framework stand for?",
          options: [
            "Impact, Confidence, and Ease",
            "Internet, Cloud, and Ethernet",
            "Impressions, Clicks, and Engagement",
            "Income, Cost, and Equity",
          ],
          correctIndex: 0,
          explanation: "ICE ranks growth experiments by expected Impact, statistical/evidence Confidence, and engineering Ease of implementation.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "dm-m5",
      title: "Marketing Automation, CRM Lifecycle Workflows & AI Growth Capstone",
      durationHours: "24 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Build automated lead scoring, WhatsApp/Email drip sequences, RFM customer segmentation, and AI-personalized lifecycle campaigns.",
      keyConcepts: [
        "RFM Segmentation: Recency, Frequency, and Monetary value tiers (Champions, At-Risk, Hibernating)",
        "Predictive Lead Scoring (Demographic fit + Behavioral intent signals)",
        "Deliverability authentication: SPF, DKIM, and DMARC records",
        "Omnichannel Lifecycle Automation (Email + WhatsApp + In-App nudges)",
      ],
      lessonNotes: `Lifecycle Marketing turns one-time buyers into repeat champions:
- RFM Analysis scores every user on Recency (days since last active), Frequency (sessions/orders), and Monetary value.When a high-value customer slips into the 'At-Risk' segment (low recency, high past frequency), an automated win-back workflow triggers before they churn permanently.
- Email Deliverability: Always configure SPF, DKIM, and DMARC DNS records so transactional and nurture emails land in the Primary Inbox rather than Spam.`,
      codeOrCaseExample: {
        title: "Behavioral & Demographic Lead Scoring Engine",
        language: "typescript",
        snippet: `export function scoreInboundLead(lead: {
  isDecisionMaker: boolean;
  visitedPricingPage: boolean;
  downloadedBrochure: boolean;
  corporateEmail: boolean;
}) {
  let score = 0;
  if (lead.corporateEmail) score += 25;
  if (lead.isDecisionMaker) score += 30;
  if (lead.visitedPricingPage) score += 25;
  if (lead.downloadedBrochure) score += 20;

  return {
    leadScore: score,
    routingAction: score >= 70 ? "INSTANT_SALES_CALL_SLA_15MIN" : "AUTOMATED_DRIP_NURTURE"
  };
}`,
        explanation: "Routing high-intent leads (score >= 70) to admissions/sales within 15 minutes increases conversion rates by up to 400%.",
      },
      handsOnLab: {
        title: "Classify Customers Using RFM (Recency, Frequency, Monetary) Logic",
        taskDescription: "Segment customers into 'Champion' (Recency <= 15 days & Frequency >= 5), 'At-Risk High Value' (Recency > 45 days & Frequency >= 5), or 'Standard'.",
        starterTemplate: `export function classifyRfmSegment(daysSinceLastActive: number, totalOrders: number): string {
  if (daysSinceLastActive <= 15 && totalOrders >= 5) return "Champion";
  if (daysSinceLastActive > 45 && totalOrders >= 5) return "At-Risk High Value";
  return "Standard Nurture";
}`,
        deliverableCriteria: "Identifies loyal Champions and flags lapsing high-frequency customers as At-Risk for win-back campaigns.",
      },
      quizQuestions: [
        {
          question: "Which three DNS authentication records are mandatory to protect domain reputation and ensure high email inbox deliverability?",
          options: [
            "SPF, DKIM, and DMARC",
            "HTML, CSS, and PNG",
            "FTP, SSH, and Telnet",
            "MP3, MP4, and WAV",
          ],
          correctIndex: 0,
          explanation: "SPF authorizes sending IPs, DKIM cryptographically signs headers, and DMARC enforces spoofing policy.",
        },
        {
          question: "In RFM Customer Segmentation, which segment represents customers who bought frequently in the past but have not visited in over 60 days?",
          options: [
            "At-Risk / Can't Lose Them (prime targets for personalized win-back automation)",
            "Brand New Visitors",
            "Active Champions",
            "Unverified Bots",
          ],
          correctIndex: 0,
          explanation: "High historical frequency/monetary value combined with poor recency signals an 'At-Risk' VIP who needs immediate re-engagement.",
        },
        {
          question: "Why does combining Demographic Fit + Behavioral Intent (e.g., visiting the Pricing/MoU page) outperform demographic-only lead scoring?",
          options: [
            "Behavioral signals capture real-time buying urgency, enabling sales teams to contact prospects at peak intent",
            "Demographics never change",
            "Pricing page visits reduce server load",
            "It eliminates the need for a CRM",
          ],
          correctIndex: 0,
          explanation: "A prospect actively viewing pricing and syllabus brochures today is far more likely to convert than a cold title match.",
        },
      ],
    },
  ],

  "prog-07-investment-banking": [
    {
      moduleNumber: 1,
      id: "ib-m1",
      title: "Corporate Finance, 3-Statement Accounting Linkages & Financial Ratios",
      durationHours: "30 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master the Income Statement, Balance Sheet, and Cash Flow Statement linkages, Working Capital dynamics, EBITDA, and ROE DuPont decomposition.",
      keyConcepts: [
        "How a ₹100 increase in Depreciation flows through all 3 Financial Statements",
        "EBITDA vs. EBIT (Operating Income) vs. Net Income vs. Free Cash Flow",
        "Net Working Capital (NWC) = (Current Assets ex-Cash) - (Current Liabilities ex-Debt)",
        "DuPont ROE Analysis: Net Profit Margin x Asset Turnover x Financial Leverage",
      ],
      lessonNotes: `The #1 technical interview question in Investment Banking is: **"Walk me through how a ₹100 increase in Depreciation affects the three financial statements (assuming a 25% tax rate)."**
1. **Income Statement**: Operating Income (EBIT) falls by ₹100. Taxes fall by ₹25 (25% tax shield), so **Net Income falls by ₹75**.
2. **Cash Flow Statement**: Start with Net Income (-₹75), add back non-cash Depreciation (+₹100) -> **Cash Flow from Operations increases by +₹25**.
3. **Balance Sheet**: Cash is up +₹25, Net PP&E is down -₹100 (Total Assets change = -₹75). On the right side, Retained Earnings is down -₹75. **The Balance Sheet balances!**`,
      codeOrCaseExample: {
        title: "3-Statement Depreciation Tax Shield Impact Simulator",
        language: "typescript",
        snippet: `export function simulateDepreciationImpact(depreciationDelta: number, taxRate = 0.25) {
  const ebitChange = -depreciationDelta;
  const taxSavings = depreciationDelta * taxRate;
  const netIncomeChange = ebitChange + taxSavings;
  const operatingCashFlowChange = netIncomeChange + depreciationDelta; // Add back non-cash D&A
  const netAssetChange = operatingCashFlowChange - depreciationDelta; // Cash +25, PP&E -100 = -75
  return {
    netIncomeChange,
    operatingCashFlowChange,
    netAssetChange,
    retainedEarningsChange: netIncomeChange,
    isBalanced: netAssetChange === netIncomeChange
  };
}`,
        explanation: "Depreciation is a non-cash expense that reduces taxable income, creating a positive cash tax shield equal to (Depreciation * Tax Rate).",
      },
      handsOnLab: {
        title: "Compute DuPont 3-Factor Return on Equity (ROE)",
        taskDescription: "Calculate Net Profit Margin (Net Income / Revenue), Asset Turnover (Revenue / Total Assets), Equity Multiplier (Total Assets / Equity), and total ROE %.",
        starterTemplate: `export function computeDuPontROE(netIncome: number, revenue: number, totalAssets: number, equity: number) {
  const netMargin = netIncome / revenue;
  const assetTurnover = revenue / totalAssets;
  const leverageMultiplier = totalAssets / equity;
  const roePercent = netMargin * assetTurnover * leverageMultiplier * 100;
  return {
    netMarginPct: Number((netMargin * 100).toFixed(2)),
    assetTurnover: Number(assetTurnover.toFixed(2)),
    leverageMultiplier: Number(leverageMultiplier.toFixed(2)),
    roePercent: Number(roePercent.toFixed(2))
  };
}`,
        deliverableCriteria: "Decomposes ROE into profitability, operational efficiency, and leverage components.",
      },
      quizQuestions: [
        {
          question: "If Depreciation increases by ₹100 and the corporate tax rate is 25%, what is the net impact on Cash at the end of the period?",
          options: [
            "Cash increases by +₹25 (due to the ₹25 tax shield saved on a non-cash expense)",
            "Cash decreases by -₹100",
            "Cash decreases by -₹75",
            "Cash does not change",
          ],
          correctIndex: 0,
          explanation: "Net income drops by ₹75, and adding back the ₹100 non-cash depreciation on the Cash Flow Statement yields +₹25 net cash.",
        },
        {
          question: "How does an increase in Accounts Receivable (customers owing money not yet collected) affect Cash Flow from Operations?",
          options: [
            "It is a cash outflow (negative adjustment to operating cash flow) because revenue was booked but cash has not yet been received",
            "It increases cash immediately",
            "It reduces long-term debt",
            "It has no effect on working capital",
          ],
          correctIndex: 0,
          explanation: "An increase in non-cash working capital assets ties up cash and reduces Free Cash Flow.",
        },
        {
          question: "What are the three drivers of Return on Equity (ROE) in the classic DuPont identity?",
          options: [
            "Net Profit Margin x Asset Turnover x Financial Leverage (Assets/Equity)",
            "Gold, Silver, and Bronze",
            "Clicks, Impressions, and CTR",
            "CPU, RAM, and Disk",
          ],
          correctIndex: 0,
          explanation: "DuPont analysis reveals whether high ROE comes from strong margins, efficient asset velocity, or heavy debt leverage.",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "ib-m2",
      title: "Dynamic 3-Statement Financial Modeling & Forecasting Mechanics",
      durationHours: "32 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Build institutional-grade 5-year financial models with revenue build-ups, working capital schedules (DSO, DIO, DPO), debt schedules, and revolver plugs.",
      keyConcepts: [
        "Top-Down (TAM/Market Share) vs. Bottom-Up (Units x Price / Cohort) Revenue Forecasting",
        "Working Capital Days: DSO (Days Sales Outstanding), DIO (Inventory), DPO (Payables)",
        "PP&E Roll-Forward Schedule (Beginning PP&E + CapEx - Depreciation = Ending PP&E)",
        "Debt & Interest Circularity handling",
      ],
      lessonNotes: `Institutional financial models project working capital using operational turnover days rather than arbitrary percentages:
- Accounts Receivable = (Revenue / 365) * DSO (Days Sales Outstanding)
- Inventory = (COGS / 365) * DIO (Days Inventory Outstanding)
- Accounts Payable = (COGS / 365) * DPO (Days Payable Outstanding)
Cash Conversion Cycle (CCC) = DSO + DIO - DPO. A lower or negative CCC means the business collects cash from customers before paying suppliers!`,
      codeOrCaseExample: {
        title: "Cash Conversion Cycle (CCC) & Working Capital Forecast Engine",
        language: "typescript",
        snippet: `export function forecastWorkingCapital(revenueCr: number, cogsCr: number, dsoDays: number, dioDays: number, dpoDays: number) {
  const receivables = (revenueCr / 365) * dsoDays;
  const inventory = (cogsCr / 365) * dioDays;
  const payables = (cogsCr / 365) * dpoDays;
  const netWorkingCapital = receivables + inventory - payables;
  const cashConversionCycleDays = dsoDays + dioDays - dpoDays;
  return {
    netWorkingCapitalCr: Number(netWorkingCapital.toFixed(2)),
    cashConversionCycleDays
  };
}`,
        explanation: "Forecasting via DSO, DIO, and DPO links Balance Sheet working capital directly to operational efficiency.",
      },
      handsOnLab: {
        title: "Build a PP&E & CapEx Roll-Forward Schedule",
        taskDescription: "Given beginning Net PP&E, new CapEx additions, and annual Depreciation expense, compute ending Net PP&E.",
        starterTemplate: `export function rollForwardPPE(beginningPPE: number, capexAdditions: number, depreciationExpense: number) {
  const endingPPE = beginningPPE + capexAdditions - depreciationExpense;
  return { beginningPPE, capexAdditions, depreciationExpense, endingPPE: Number(endingPPE.toFixed(2)) };
}`,
        deliverableCriteria: "Accurately implements the BASE (Beginning + Additions - Subtractions = Ending) corkscrew schedule.",
      },
      quizQuestions: [
        {
          question: "How is the Cash Conversion Cycle (CCC) calculated?",
          options: [
            "CCC = DSO (Days Sales Outstanding) + DIO (Days Inventory Outstanding) - DPO (Days Payable Outstanding)",
            "CCC = Revenue - Expenses",
            "CCC = Assets + Liabilities",
            "CCC = DPO + DSO + Tax Rate",
          ],
          correctIndex: 0,
          explanation: "CCC measures how many days cash is tied up in inventory and receivables before payables come due.",
        },
        {
          question: "In the PP&E (Property, Plant & Equipment) roll-forward schedule, what is the formula for Ending Net PP&E?",
          options: [
            "Beginning Net PP&E + Capital Expenditures (CapEx) - Depreciation (and asset disposals)",
            "Beginning Net PP&E - CapEx + Depreciation",
            "Revenue x Gross Margin",
            "Cash + Short-Term Debt",
          ],
          correctIndex: 0,
          explanation: "CapEx increases fixed assets while Depreciation reduces their net carrying book value over their useful life.",
        },
        {
          question: "What causes 'Circularity' in a 3-statement financial model?",
          options: [
            "Interest Expense depends on Average Debt/Cash, which depends on Net Income, which itself depends on Interest Expense",
            "Using bold fonts in Excel",
            "Forecasting more than 3 years",
            "Having zero debt",
          ],
          correctIndex: 0,
          explanation: "Linking interest to average debt creates a circular reference between the Income Statement, Cash Flow Statement, and Debt Schedule.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "ib-m3",
      title: "Intrinsic & Relative Valuation (DCF, WACC, Trading Comps & Precedent M&A)",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Value enterprises using Unlevered Free Cash Flow (UFCF), WACC (CAPM Cost of Equity + After-Tax Debt), Terminal Value, and EV/EBITDA multiples.",
      keyConcepts: [
        "Enterprise Value (EV) = Market Cap + Total Debt + Preferred Stock + Minority Interest - Cash",
        "Unlevered Free Cash Flow (UFCF) = EBIT * (1 - Tax Rate) + D&A - CapEx - Change in NWC",
        "WACC (Weighted Average Cost of Capital) & CAPM Cost of Equity (Rf + Beta * ERP)",
        "Terminal Value: Gordon Growth Perpetuity vs. Exit EV/EBITDA Multiple",
      ],
      lessonNotes: `In a Discounted Cash Flow (DCF) valuation:
1. We project Unlevered Free Cash Flow (UFCF)—cash available to ALL capital providers (both debt and equity holders)—so we discount it at **WACC**, yielding **Enterprise Value (EV)**.
2. To bridge from Enterprise Value to Implied **Equity Value (Market Cap)**, we subtract Net Debt:
**Implied Equity Value = Enterprise Value - Total Debt + Cash & Equivalents**.`,
      codeOrCaseExample: {
        title: "DCF Enterprise Value & Implied Share Price Engine",
        language: "typescript",
        snippet: `export function calculateDcfValuation(
  ufcfFiveYears: number[],
  wacc: number,
  terminalGrowthRate: number,
  netDebt: number,
  dilutedSharesCr: number
) {
  let pvOfCashFlows = 0;
  ufcfFiveYears.forEach((cf, idx) => {
    pvOfCashFlows += cf / Math.pow(1 + wacc, idx + 1);
  });

  const finalYearCf = ufcfFiveYears[ufcfFiveYears.length - 1];
  const terminalValue = (finalYearCf * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);
  const pvOfTerminalValue = terminalValue / Math.pow(1 + wacc, ufcfFiveYears.length);

  const enterpriseValue = pvOfCashFlows + pvOfTerminalValue;
  const equityValue = enterpriseValue - netDebt;
  const impliedSharePrice = equityValue / Math.max(0.01, dilutedSharesCr);

  return {
    enterpriseValueCr: Math.round(enterpriseValue),
    equityValueCr: Math.round(equityValue),
    impliedSharePriceINR: Number(impliedSharePrice.toFixed(2))
  };
}`,
        explanation: "Discounting UFCF and Gordon Growth Terminal Value by WACC yields Enterprise Value; subtracting Net Debt bridges to Equity Value.",
      },
      handsOnLab: {
        title: "Compute WACC (Weighted Average Cost of Capital)",
        taskDescription: "Write a WACC calculator given Cost of Equity (Ke), pre-tax Cost of Debt (Kd), corporate tax rate, and target Debt/Equity weights.",
        starterTemplate: `export function computeWacc(kePct: number, kdPct: number, taxRatePct: number, equityWeight: number, debtWeight: number) {
  const afterTaxKd = kdPct * (1 - taxRatePct / 100);
  const wacc = kePct * equityWeight + afterTaxKd * debtWeight;
  return { afterTaxCostOfDebtPct: Number(afterTaxKd.toFixed(2)), waccPct: Number(wacc.toFixed(2)) };
}`,
        deliverableCriteria: "Applies the corporate tax shield (1 - t) to the cost of debt and weights by capital structure proportions.",
      },
      quizQuestions: [
        {
          question: "Why do we subtract Cash and add Total Debt when calculating Enterprise Value (EV = Equity Value + Debt - Cash)?",
          options: [
            "Because an acquirer buying 100% of the company assumes its Debt obligations but gets to keep its Cash balance (reducing net purchase price)",
            "Because Cash is a liability",
            "Because Debt has zero interest",
            "To make the number negative",
          ],
          correctIndex: 0,
          explanation: "Cash reduces the net cost to acquire the operating business, while Debt must be assumed or refinanced by the buyer.",
        },
        {
          question: "Why can you NEVER use 'EV / Net Income' as a valuation multiple?",
          options: [
            "Denominator mismatch: Enterprise Value (EV) belongs to both Debt and Equity holders, whereas Net Income is after interest and belongs only to Equity holders (use P/E or EV/EBITDA instead)",
            "Net Income is always zero",
            "EBITDA includes interest expense",
            "Excel cannot divide EV by Net Income",
          ],
          correctIndex: 0,
          explanation: "Valuation multiples must maintain numerator-denominator consistency: pair EV with unlevered metrics (Revenue, EBITDA, EBIT) and Market Cap with levered metrics (Net Income/EPS).",
        },
        {
          question: "Between Comparable Public Companies ('Trading Comps') and Precedent M&A Transactions, which typically yields a higher valuation multiple and why?",
          options: [
            "Precedent M&A Transactions, because acquirers pay a Control Premium (typically 20%–35%) and price in expected synergies",
            "Trading Comps are always 10x higher",
            "They are always identical to the penny",
            "Precedent M&A multiples are always negative",
          ],
          correctIndex: 0,
          explanation: "M&A transactions include a control takeover premium over unaffected public trading prices.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "ib-m4",
      title: "M&A Deal Structuring (Accretion/Dilution), LBO Modeling & Pitchbooks",
      durationHours: "34 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Model M&A EPS Accretion/Dilution across Cash/Stock/Debt consideration and Private Equity Leveraged Buyout (LBO) IRR & MOIC returns.",
      keyConcepts: [
        "M&A Accretion / Dilution: Comparing Buyer P/E vs. Effective Acquisition P/E (and after-tax cost of debt/cash)",
        "Goodwill creation in M&A = Equity Purchase Price - Fair Value of Net Identifiable Assets",
        "LBO Mechanics: Debt tranches (Senior Term Loan vs. Subordinated High-Yield), Cash Sweep & Exit Multiple",
        "Private Equity Return Metrics: IRR (Internal Rate of Return) & MOIC (Multiple on Invested Capital)",
      ],
      lessonNotes: `In a 100% All-Stock M&A transaction, there is a fast rule of thumb for Accretion/Dilution:
- If the **Acquirer's P/E multiple is HIGHER than the Target's acquisition P/E multiple** (even before synergies), the deal is **Accretive** to the Acquirer's Earnings Per Share (EPS), because the Acquirer is using expensive currency (high P/E shares) to buy cheaper earnings!
In a Private Equity LBO, value is created through three levers: **1) De-leveraging (paying down debt with FCF)**, **2) EBITDA Growth**, and **3) Multiple Expansion**.`,
      codeOrCaseExample: {
        title: "Private Equity LBO MOIC & IRR Return Calculator",
        language: "typescript",
        snippet: `export function calculateLboReturns(
  entryEbitda: number,
  entryMultiple: number,
  initialDebt: number,
  exitEbitda: number,
  exitMultiple: number,
  endingDebt: number,
  holdingYears = 5
) {
  const entryEv = entryEbitda * entryMultiple;
  const sponsorInitialEquity = entryEv - initialDebt;

  const exitEv = exitEbitda * exitMultiple;
  const sponsorExitEquity = exitEv - endingDebt;

  const moic = sponsorExitEquity / Math.max(1, sponsorInitialEquity);
  const irrPercent = (Math.pow(moic, 1 / holdingYears) - 1) * 100;

  return {
    sponsorInitialEquityCr: Math.round(sponsorInitialEquity),
    sponsorExitEquityCr: Math.round(sponsorExitEquity),
    moic: Number(moic.toFixed(2)),
    irrPercent: Number(irrPercent.toFixed(2))
  };
}`,
        explanation: "Sponsor IRR = (Ending Equity / Initial Equity)^(1 / Years) - 1. Notice how paying down debt directly increases Ending Equity.",
      },
      handsOnLab: {
        title: "Evaluate All-Stock M&A EPS Accretion / Dilution",
        taskDescription: "Given Buyer Net Income, Buyer Shares, Target Net Income, and New Shares Issued to acquire Target, compute Pro-Forma EPS and whether the deal is Accretive or Dilutive.",
        starterTemplate: `export function analyzeStockMergerEps(buyerNetIncome: number, buyerShares: number, targetNetIncome: number, newSharesIssued: number, afterTaxSynergies = 0) {
  const standaloneEps = buyerNetIncome / buyerShares;
  const proFormaEps = (buyerNetIncome + targetNetIncome + afterTaxSynergies) / (buyerShares + newSharesIssued);
  const changePct = ((proFormaEps - standaloneEps) / standaloneEps) * 100;
  return {
    standaloneEps: Number(standaloneEps.toFixed(2)),
    proFormaEps: Number(proFormaEps.toFixed(2)),
    accretionDilutionPct: Number(changePct.toFixed(2)),
    status: proFormaEps >= standaloneEps ? "ACCRETIVE" : "DILUTIVE"
  };
}`,
        deliverableCriteria: "Computes Standalone EPS vs Pro-Forma Combined EPS and classifies Accretive vs Dilutive impact.",
      },
      quizQuestions: [
        {
          question: "In a 100% All-Stock M&A deal with zero synergies, if Acquirer trades at 25x P/E and buys Target at 15x P/E, is the deal Accretive or Dilutive to EPS?",
          options: [
            "Accretive (Acquirer's Earnings Yield of 4% is lower than Target's Earnings Yield of 6.67%, boosting combined EPS)",
            "Dilutive",
            "It bankrupts the acquirer",
            "P/E multiples do not affect stock deals",
          ],
          correctIndex: 0,
          explanation: "Buying higher-yielding earnings (1/15 = 6.67%) using lower-cost stock currency (1/25 = 4.0%) increases EPS.",
        },
        {
          question: "If a Private Equity firm invests ₹100 Cr of sponsor equity in an LBO and exits in 5 years for ₹200 Cr of equity (2.0x MOIC), what is the approximate IRR?",
          options: [
            "~15% IRR (since 1.1487^5 = 2.0)",
            "100% IRR",
            "2% IRR",
            "50% IRR",
          ],
          correctIndex: 0,
          explanation: "Doubling equity (2.0x MOIC) in 5 years corresponds to 2^(1/5) - 1 = 14.87% (~15% IRR).",
        },
        {
          question: "What are the 3 primary characteristics of an ideal LBO candidate company?",
          options: [
            "Stable & predictable Free Cash Flows (to service debt), strong defensive market moat, and low ongoing CapEx requirements",
            "Negative cash flow, extreme cyclicality, and already 95% debt-funded",
            "Pre-revenue startup with no assets",
            "High litigation risk",
          ],
          correctIndex: 0,
          explanation: "Because LBOs use substantial debt leverage (50%–70%), steady recurring cash flow is mandatory to meet interest and principal payments.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "ib-m5",
      title: "Python & Power BI for Quantitative Risk, Portfolio Analytics & FinTech Capstone",
      durationHours: "30 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Automate portfolio Sharpe Ratio optimization, Monte Carlo Value-at-Risk (VaR) simulations, and executive financial dashboards.",
      keyConcepts: [
        "Modern Portfolio Theory: Expected Return, Volatility (Standard Deviation) & Covariance Matrix",
        "Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Volatility",
        "Value at Risk (VaR 95% & 99%) & Expected Shortfall (CVaR) for institutional risk management",
        "Automated Financial Dashboards in Power BI & Python",
      ],
      lessonNotes: `Quantitative analysts evaluate returns on a risk-adjusted basis:
- **Sharpe Ratio**: Measures excess return per unit of total volatility. A Sharpe Ratio > 1.0 is good; > 2.0 is institutional excellence.
- **Value at Risk (VaR)**: Estimates the maximum expected loss over a given time horizon (e.g., 1-day) at a specific confidence level (e.g., 95% or 99%—1.645 or 2.326 standard deviations under parametric normal assumptions).`,
      codeOrCaseExample: {
        title: "Portfolio Sharpe Ratio & Parametric 99% Value-at-Risk (VaR)",
        language: "typescript",
        snippet: `export function analyzePortfolioRisk(
  portfolioValueINR: number,
  annualReturnPct: number,
  annualVolatilityPct: number,
  riskFreeRatePct = 6.8
) {
  const sharpeRatio = (annualReturnPct - riskFreeRatePct) / Math.max(0.1, annualVolatilityPct);
  const dailyVol = (annualVolatilityPct / 100) / Math.sqrt(252); // 252 trading days
  const var99DailyINR = portfolioValueINR * 2.326 * dailyVol;

  return {
    sharpeRatio: Number(sharpeRatio.toFixed(2)),
    dailyVaR99INR: Math.round(var99DailyINR)
  };
}`,
        explanation: "Scaling annual volatility by 1/sqrt(252) converts it to daily volatility; multiplying by z = 2.326 gives the 99% 1-day parametric VaR.",
      },
      handsOnLab: {
        title: "Compute Maximum Drawdown of an Investment Strategy",
        taskDescription: "Given a time series of portfolio NAV values, compute the Maximum Drawdown percentage from peak to subsequent trough.",
        starterTemplate: `export function calculateMaxDrawdownPct(navSeries: number[]): number {
  let peak = navSeries[0] || 1;
  let maxDd = 0;
  for (const nav of navSeries) {
    if (nav > peak) peak = nav;
    const dd = ((peak - nav) / peak) * 100;
    if (dd > maxDd) maxDd = dd;
  }
  return Number(maxDd.toFixed(2));
}`,
        deliverableCriteria: "Tracks running peak NAV and finds the largest percentage drop from peak to trough.",
      },
      quizQuestions: [
        {
          question: "How is the Sharpe Ratio of an investment portfolio calculated?",
          options: [
            "(Expected Portfolio Return - Risk-Free Rate) / Portfolio Standard Deviation (Volatility)",
            "Total Assets / Total Liabilities",
            "Revenue / Headcount",
            "Net Income / Shares",
          ],
          correctIndex: 0,
          explanation: "The Sharpe Ratio measures excess return earned above the risk-free rate per unit of volatility risk.",
        },
        {
          question: "Why do we divide annual volatility by sqrt(252) when converting to daily trading volatility?",
          options: [
            "There are ~252 trading days in a year, and variance scales linearly with time (so standard deviation scales with the square root of time)",
            "Because there are 252 months in a year",
            "Because 252 is a prime number",
            "To convert USD to INR",
          ],
          correctIndex: 0,
          explanation: "Under independent increments, variance is proportional to T, so volatility (std dev) is proportional to sqrt(T).",
        },
        {
          question: "What does a 1-Day 99% Value at Risk (VaR) of ₹15 Lakhs mean for a trading desk?",
          options: [
            "Under normal market conditions, there is a 99% probability that single-day portfolio losses will not exceed ₹15 Lakhs (or a 1% chance loss exceeds ₹15L)",
            "The desk is guaranteed to make ₹15 Lakhs profit every day",
            "The portfolio is worth ₹15 Lakhs total",
            "Taxes are 99%",
          ],
          correctIndex: 0,
          explanation: "99% 1-Day VaR defines the loss threshold that is expected to be breached on only 1% of trading days.",
        },
      ],
    },
  ],

  "prog-08-ds-business": [
    {
      moduleNumber: 1,
      id: "dsbiz-m1",
      title: "Business Intelligence Foundations, KPI Trees & Executive Problem Framing",
      durationHours: "18 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Translate ambiguous executive business questions into measurable Leading vs. Lagging KPI trees and structured analytical hypotheses.",
      keyConcepts: [
        "Leading Indicators (predictive inputs) vs. Lagging Indicators (historical outcomes)",
        "MECE (Mutually Exclusive, Collectively Exhaustive) KPI Issue Trees",
        "Avoiding Vanity Metrics vs. Actionable North Star Metrics",
        "Framing ROI of Data Science initiatives (Expected Value framework)",
      ],
      lessonNotes: `Executive decision-makers don't buy algorithms; they buy business outcomes (Revenue Growth, Cost Reduction, or Risk Mitigation).
Use a **MECE KPI Tree** to break down top-line metrics:
- **Revenue** = Active Customers x Order Frequency x Average Basket Size.
- **Leading Indicator**: Week-1 feature adoption rate (predicts future renewal).
- **Lagging Indicator**: Quarterly Net Revenue Retention (measures past outcome).`,
      codeOrCaseExample: {
        title: "Expected Value (EV) Decision Matrix for AI/Data Projects",
        language: "typescript",
        snippet: `export function evaluateBusinessCaseROI(
  annualSavingsINR: number,
  implementationCostINR: number,
  probabilityOfSuccessPct: number
) {
  const expectedAnnualBenefit = annualSavingsINR * (probabilityOfSuccessPct / 100);
  const netExpectedValueYear1 = expectedAnnualBenefit - implementationCostINR;
  const roiPercent = (netExpectedValueYear1 / Math.max(1, implementationCostINR)) * 100;
  return {
    expectedAnnualBenefitINR: Math.round(expectedAnnualBenefit),
    netExpectedValueYear1INR: Math.round(netExpectedValueYear1),
    roiPercent: Number(roiPercent.toFixed(1)),
    recommendation: netExpectedValueYear1 > 0 ? "APPROVE_INVESTMENT" : "RE-SCOPE_PROJECT"
  };
}`,
        explanation: "Weighting projected benefits by realistic execution probability prevents over-investing in low-feasibility moonshots.",
      },
      handsOnLab: {
        title: "Decompose Revenue Change into Volume vs. Price Effects",
        taskDescription: "Write a bridge analysis function that calculates total revenue change and splits it into Volume Effect and Price Effect.",
        starterTemplate: `export function revenueBridgeAnalysis(oldUnits: number, oldPrice: number, newUnits: number, newPrice: number) {
  const oldRev = oldUnits * oldPrice;
  const newRev = newUnits * newPrice;
  const volumeEffect = (newUnits - oldUnits) * oldPrice;
  const priceEffect = (newPrice - oldPrice) * newUnits;
  return { oldRev, newRev, totalDelta: newRev - oldRev, volumeEffect, priceEffect };
}`,
        deliverableCriteria: "Decomposes period-over-period revenue variance into volume and price drivers.",
      },
      quizQuestions: [
        {
          question: "What is the difference between a Leading Indicator and a Lagging Indicator?",
          options: [
            "Leading indicators predict future performance and can be acted on early; Lagging indicators measure past results after the period closes",
            "Leading indicators are always financial; Lagging indicators are never numerical",
            "They are identical",
            "Lagging indicators predict next year's weather",
          ],
          correctIndex: 0,
          explanation: "Leading indicators (e.g., qualified pipeline created this week) give managers time to intervene before quarterly revenue (lagging) misses.",
        },
        {
          question: "What does MECE stand for in structured management and analytical problem-solving?",
          options: [
            "Mutually Exclusive, Collectively Exhaustive (no overlapping categories, no missing gaps)",
            "Most Expensive Corporate Enterprise",
            "Mean Error Calculation Engine",
            "Manual Excel Copy Export",
          ],
          correctIndex: 0,
          explanation: "MECE decomposition ensures every driver is counted once (no double counting) and all possibilities are covered.",
        },
        {
          question: "Why is 'Total Cumulative Registered Users Since 2018' considered a Vanity Metric?",
          options: [
            "Because it only goes up and hides whether users are actually active, retained, or generating value today",
            "Because it is too difficult to query in SQL",
            "Because investors dislike growth",
            "Because it changes every millisecond",
          ],
          correctIndex: 0,
          explanation: "Actionable metrics like Weekly Active Users (WAU) or Cohort Retention reflect true current product health.",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "dsbiz-m2",
      title: "Executive Dashboards with Power BI, DAX & Tableau Visual Analytics",
      durationHours: "22 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Design clean Star-Schema data models in Power BI, write DAX time-intelligence measures (YoY, MoM, YTD), and apply cognitive visual hierarchy.",
      keyConcepts: [
        "Calculated Columns (row-by-row, consumes RAM) vs. DAX Measures (dynamic filter-context evaluation)",
        "DAX CALCULATE(), SAMEPERIODLASTYEAR(), and TOTALYTD() time intelligence",
        "Row-Level Security (RLS) for regional managers and department heads",
        "Visual Design: Eliminating pie-chart clutter, using waterfall charts & variance bars",
      ],
      lessonNotes: `In Power BI, beginners overuse Calculated Columns, which materialize values in every row and bloat memory.
Always prefer **DAX Measures** for ratios and percentages (e.g., \`Gross Margin % = DIVIDE(SUM(Sales[Profit]), SUM(Sales[Revenue]), 0)\`), because ratios of sums cannot be averaged across rows—they must be computed dynamically within the user's current slicer Filter Context!`,
      codeOrCaseExample: {
        title: "Dynamic Year-over-Year (YoY) & Margin Variance Engine",
        language: "typescript",
        snippet: `export function computeExecutiveVariance(currentPeriodRev: number, priorYearRev: number, targetBudgetRev: number) {
  const yoyGrowthPct = ((currentPeriodRev - priorYearRev) / Math.max(1, priorYearRev)) * 100;
  const budgetAttainmentPct = (currentPeriodRev / Math.max(1, targetBudgetRev)) * 100;
  return {
    yoyGrowthPct: Number(yoyGrowthPct.toFixed(2)),
    budgetAttainmentPct: Number(budgetAttainmentPct.toFixed(1)),
    statusColor: budgetAttainmentPct >= 100 ? "GREEN_ON_TRACK" : budgetAttainmentPct >= 90 ? "AMBER_WATCH" : "RED_AT_RISK"
  };
}`,
        explanation: "Executive KPI cards should always pair the raw number with two comparisons: vs. Prior Year (YoY%) and vs. Target (% Attainment).",
      },
      handsOnLab: {
        title: "Build a Weighted Margin Aggregator (Avoiding Simple Average Traps)",
        taskDescription: "Compute the true blended profit margin across multiple regions by dividing Total Profit by Total Revenue (rather than averaging regional percentages).",
        starterTemplate: `export function calculateBlendedMarginPct(regions: { revenue: number; profit: number }[]): number {
  const totalRev = regions.reduce((sum, r) => sum + r.revenue, 0);
  const totalProfit = regions.reduce((sum, r) => sum + r.profit, 0);
  return totalRev > 0 ? Number(((totalProfit / totalRev) * 100).toFixed(2)) : 0;
}`,
        deliverableCriteria: "Sums numerator and denominator first before dividing, avoiding Simpson's/unweighted average bias.",
      },
      quizQuestions: [
        {
          question: "In Power BI DAX, why should Gross Margin % be written as a Measure (`DIVIDE(SUM(Profit), SUM(Revenue))`) rather than a Calculated Column?",
          options: [
            "Because percentages cannot be summed or averaged across rows; a Measure dynamically sums Profit and Revenue for the active slicer filter context first",
            "Because Calculated Columns cannot do division",
            "Because Measures are stored as JPEG images",
            "There is no difference",
          ],
          correctIndex: 0,
          explanation: "Averaging a 50% margin on a ₹10 sale with a 10% margin on a ₹1,000,000 sale gives a false 30% average; summing first gives the true ~10% margin.",
        },
        {
          question: "Which chart type is best for showing how Starting Operating Profit bridges step-by-step through positive and negative variances to Ending Operating Profit?",
          options: [
            "Waterfall Chart (Bridge Chart)",
            "3D Exploded Pie Chart with 25 slices",
            "Word Cloud",
            "Radar Spider Chart",
          ],
          correctIndex: 0,
          explanation: "Waterfall charts clearly visualize cumulative positive and negative drivers between two baseline totals.",
        },
        {
          question: "What Power BI feature restricts a Regional Sales Director in Odisha to seeing only Odisha rows while using the same shared dashboard?",
          options: [
            "Row-Level Security (RLS)",
            "Dark Mode theme",
            "Bookmark buttons",
            "Tooltip pages",
          ],
          correctIndex: 0,
          explanation: "RLS applies role-based DAX filter predicates at the dataset model level based on the logged-in user's principal name.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "dsbiz-m3",
      title: "SQL & Predictive Analytics for Managers (Forecasting & Elasticity)",
      durationHours: "20 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Run cohort queries in SQL, forecast seasonal demand, and model Price Elasticity of Demand to optimize pricing and inventory.",
      keyConcepts: [
        "Price Elasticity of Demand (PED = % Change in Quantity / % Change in Price)",
        "Time-Series Decomposition: Trend, Seasonality, and Residual Noise",
        "Moving Averages & Exponential Smoothing for inventory/staffing forecasts",
        "Confusion Matrix business translation: Cost of False Positives vs. Cost of False Negatives",
      ],
      lessonNotes: `When using Predictive Models for business decisions, threshold selection is an economic decision:
- Suppose a Churn Retention offer costs ₹500 per customer, and saving a churning customer preserves ₹10,000 in LTV.
- Even if a customer has only a **15% predicted probability of churning**, the expected value of intervening is \`0.15 * ₹10,000 = ₹1,500 > ₹500 cost\`, so the optimal probability threshold is **p >= 5%**, not the default 50%!`,
      codeOrCaseExample: {
        title: "Cost-Sensitive ML Decision Threshold Optimizer",
        language: "typescript",
        snippet: `export function findOptimalInterventionThreshold(
  interventionCostINR: number,
  savedCustomerLtvINR: number,
  successRateOfOffer = 0.5
) {
  const expectedBenefitWhenTrueChurner = savedCustomerLtvINR * successRateOfOffer;
  const breakevenChurnProbability = interventionCostINR / Math.max(1, expectedBenefitWhenTrueChurner);
  return {
    optimalProbabilityThreshold: Number(breakevenChurnProbability.toFixed(3)),
    explanation: \`Trigger retention offer whenever predicted churn probability >= \${(breakevenChurnProbability * 100).toFixed(1)}%\`
  };
}`,
        explanation: "Aligning ML probability thresholds with real financial costs and benefits maximizes net profit.",
      },
      handsOnLab: {
        title: "Calculate Price Elasticity of Demand & Revenue Impact",
        taskDescription: "Given old/new price and old/new quantity demanded, compute Price Elasticity of Demand (PED) and classify whether demand is Elastic (|PED| > 1) or Inelastic.",
        starterTemplate: `export function calculatePriceElasticity(oldPrice: number, newPrice: number, oldQty: number, newQty: number) {
  const pctChangeQty = (newQty - oldQty) / oldQty;
  const pctChangePrice = (newPrice - oldPrice) / oldPrice;
  const ped = pctChangeQty / pctChangePrice;
  return {
    elasticity: Number(ped.toFixed(2)),
    demandType: Math.abs(ped) > 1 ? "ELASTIC (Price Sensitive)" : "INELASTIC (Pricing Power)"
  };
}`,
        deliverableCriteria: "Computes PED ratio and classifies whether the product exhibits elastic or inelastic demand.",
      },
      quizQuestions: [
        {
          question: "If a SaaS product raises prices by 10% and unit sales drop by only 2% (Price Elasticity = -0.2), demand is:",
          options: [
            "Inelastic (|PED| < 1), meaning the price increase boosts total revenue",
            "Perfectly Elastic, meaning revenue drops to zero",
            "Unrelated to price",
            "Negative revenue",
          ],
          correctIndex: 0,
          explanation: "When |PED| < 1, quantity falls proportionally less than the price hike, increasing total revenue.",
        },
        {
          question: "Why shouldn't business leaders blindly use 0.50 (50%) as the classification probability cutoff for every ML model?",
          options: [
            "Because the financial cost of a False Negative (missing fraud/churn) is often 10x–50x higher than the cost of a False Positive",
            "Because ML models only output integers",
            "Because 0.50 is not a valid probability",
            "Because accuracy is always 100% at 0.99",
          ],
          correctIndex: 0,
          explanation: "Optimal probability cutoffs depend on the asymmetric business cost matrix of False Positives vs. False Negatives.",
        },
        {
          question: "What are the three classic components of a seasonal time-series forecast?",
          options: [
            "Trend, Seasonality, and Residual (Irregular/Noise)",
            "Latitude, Longitude, and Altitude",
            "Header, Body, and Footer",
            "Mean, Mode, and Range",
          ],
          correctIndex: 0,
          explanation: "Time-series decomposition separates long-term Trend from recurring cyclic Seasonality and random Residuals.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "dsbiz-m4",
      title: "Customer Segmentation, Churn Prevention & Revenue Optimization",
      durationHours: "18 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Use uplift modeling, NRR (Net Revenue Retention), and cohort analysis to maximize expansion revenue and cut voluntary/involuntary churn.",
      keyConcepts: [
        "Gross Revenue Retention (GRR) vs. Net Revenue Retention (NRR / NDR)",
        "Uplift Modeling: Targeting 'Persuadables' while avoiding 'Sure Things' and 'Sleeping Dogs'",
        "Voluntary Churn (product/value gap) vs. Involuntary Churn (failed payments/dunning)",
        "Pareto Principle (80/20 concentration risk) in enterprise accounts",
      ],
      lessonNotes: `In Uplift Modeling for retention and promotions, customers fall into four quadrants:
1. **Persuadables**: Will stay ONLY if contacted with the retention offer -> **Target these!**
2. **Sure Things**: Will stay anyway even without a discount -> Don't waste discount margin!
3. **Lost Causes**: Will churn regardless of offer.
4. **Sleeping Dogs**: Contacting them actually reminds them to cancel!`,
      codeOrCaseExample: {
        title: "SaaS & Subscription Net Revenue Retention (NRR) Calculator",
        language: "typescript",
        snippet: `export function calculateNetRevenueRetention(
  startingMrrINR: number,
  expansionMrrINR: number,
  contractionMrrINR: number,
  churnedMrrINR: number
) {
  const endingCohortMrr = startingMrrINR + expansionMrrINR - contractionMrrINR - churnedMrrINR;
  const nrrPercent = (endingCohortMrr / Math.max(1, startingMrrINR)) * 100;
  const grrPercent = ((startingMrrINR - contractionMrrINR - churnedMrrINR) / Math.max(1, startingMrrINR)) * 100;
  return {
    nrrPercent: Number(nrrPercent.toFixed(1)),
    grrPercent: Number(grrPercent.toFixed(1)),
    worldClassBenchmark: nrrPercent >= 110
  };
}`,
        explanation: "When NRR > 100%, the business grows every year from existing customers alone (via upsells/expansion) even before adding new logos!",
      },
      handsOnLab: {
        title: "Classify Customers in an Uplift Targeting Matrix",
        taskDescription: "Given P(Stay | Treated) and P(Stay | Control), compute Uplift Score and decide whether to send a promotional discount.",
        starterTemplate: `export function computeUpliftAction(probStayIfTreated: number, probStayIfControl: number) {
  const uplift = probStayIfTreated - probStayIfControl;
  if (uplift >= 0.15) return { uplift: Number(uplift.toFixed(2)), segment: "Persuadable (Send Offer)" };
  if (probStayIfControl >= 0.85) return { uplift: Number(uplift.toFixed(2)), segment: "Sure Thing (Save Discount)" };
  if (uplift < 0) return { uplift: Number(uplift.toFixed(2)), segment: "Sleeping Dog (Do Not Disturb)" };
  return { uplift: Number(uplift.toFixed(2)), segment: "Low Uplift" };
}`,
        deliverableCriteria: "Computes net treatment uplift and avoids wasting discounts on Sure Things or triggering Sleeping Dogs.",
      },
      quizQuestions: [
        {
          question: "How can Net Revenue Retention (NRR) exceed 100% (e.g., 120% NRR)?",
          options: [
            "When expansion revenue (upsells, cross-sells, seat growth) from existing customers exceeds churn and downgrades",
            "By counting new customers twice",
            "Gross Retention can be 150%",
            "By ignoring cancellations",
          ],
          correctIndex: 0,
          explanation: "NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR. Strong expansion drives NRR > 100%.",
        },
        {
          question: "In Uplift Modeling, why shouldn't you send a 20% retention discount to customers with a 95% baseline renewal probability ('Sure Things')?",
          options: [
            "Because they would have renewed at full price anyway, so the discount purely cannibalizes profit margin with zero retention lift",
            "Because loyal customers dislike emails",
            "Because uplift is always 100%",
            "Because discounts increase prices",
          ],
          correctIndex: 0,
          explanation: "Uplift modeling optimizes incremental impact (Treatment - Control) rather than raw renewal probability.",
        },
        {
          question: "What is 'Involuntary Churn' and how is it best reduced?",
          options: [
            "Churn caused by expired credit cards or failed payment gateways, reduced via smart payment retries and automated dunning reminders",
            "Customers switching to a competitor due to missing features",
            "Employees retiring",
            "Server maintenance windows",
          ],
          correctIndex: 0,
          explanation: "Involuntary churn often accounts for 20%–30% of subscription churn and is fixed via payment retry orchestration.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "dsbiz-m5",
      title: "Executive Data Storytelling, Pyramid Principle & Boardroom Case Capstone",
      durationHours: "18 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Present data-driven recommendations using the Minto Pyramid Principle (Answer-First), Situation-Complication-Resolution (SCR), and executive memos.",
      keyConcepts: [
        "Minto Pyramid Principle: Lead with the Governing Conclusion/Action first, backed by 3 data pillars",
        "SCR Narrative Arc: Situation -> Complication -> Resolution",
        "Action Titles on slides ('Odisha Enterprise Churn Fell 18% After AI Onboarding' vs. 'Churn Chart')",
        "Sensitivity & Scenario Analysis (Bear, Base, Bull cases) for board approval",
      ],
      lessonNotes: `Academics present chronologically (Background -> Methodology -> Data Cleaning -> Conclusion on Slide 40).
Executives think **Top-Down (Minto Pyramid Principle)**:
- **Slide 1 / Paragraph 1**: State the **Recommendation & Quantified Financial Impact** immediately ("Reallocating ₹20L to Hybrid Campus Cohorts will increase placements by 34% and generate ₹1.2Cr net margin").
- **Supporting Pillars**: Present the 3 MECE evidence blocks (Market Demand, Unit Economics, Risk Mitigation).`,
      codeOrCaseExample: {
        title: "Boardroom Bear / Base / Bull Scenario Sensitivity Generator",
        language: "typescript",
        snippet: `export function generateExecutiveScenarios(baseUnits: number, priceINR: number, fixedCostINR: number, variableCostPerUnit: number) {
  const calcProfit = (mult: number) => {
    const units = Math.round(baseUnits * mult);
    const rev = units * priceINR;
    const profit = rev - fixedCostINR - units * variableCostPerUnit;
    return { units, revenueINR: rev, operatingProfitINR: profit };
  };
  return {
    bearCase: calcProfit(0.8),
    baseCase: calcProfit(1.0),
    bullCase: calcProfit(1.25)
  };
}`,
        explanation: "Presenting Bear (-20%), Base, and Bull (+25%) scenarios builds instant credibility with CFOs and board members.",
      },
      handsOnLab: {
        title: "Convert a Weak Slide Header into a Quantified Executive Action Title",
        taskDescription: "Write a formatter that takes a metric name, percentage improvement, and financial impact to produce a Pyramid-Principle executive headline.",
        starterTemplate: `export function buildExecutiveActionTitle(metric: string, changePct: number, annualImpactCr: number): string {
  const direction = changePct >= 0 ? "Increased" : "Reduced";
  return \`\${metric} \${direction} by \${Math.abs(changePct)}%, Unlocking ₹\${annualImpactCr} Cr in Annual Value\`;
}`,
        deliverableCriteria: "Produces a concise, outcome-first headline stating metric movement and rupee impact.",
      },
      quizQuestions: [
        {
          question: "According to Barbara Minto's Pyramid Principle, how should you structure an executive presentation or memo?",
          options: [
            "Start with the main Recommendation and quantified conclusion first, then support it with 3 grouped evidence pillars",
            "Spend the first 25 minutes explaining how you cleaned null values in Python",
            "Hide the conclusion until the final slide",
            "Show raw SQL code on every slide",
          ],
          correctIndex: 0,
          explanation: "Answer-First communication respects executive time and frames how the audience interprets supporting charts.",
        },
        {
          question: "Which slide title follows executive Data Storytelling best practices?",
          options: [
            "'Automated Dunning Reduced Involuntary Churn by 28%, Saving ₹1.4 Cr/Year'",
            "'Slide 4: Monthly Churn Scatter Plot'",
            "'Data Overview'",
            "'Q3 Numbers'",
          ],
          correctIndex: 0,
          explanation: "Action titles state the takeaway insight and business impact directly in the header.",
        },
        {
          question: "Why should strategic proposals include Bear, Base, and Bull sensitivity scenarios?",
          options: [
            "To demonstrate downside protection (breakeven resilience) under conservative assumptions alongside upside potential",
            "To confuse the audience with more numbers",
            "Because Base case is always wrong",
            "To avoid making a recommendation",
          ],
          correctIndex: 0,
          explanation: "Decision-makers want to know if the initiative remains viable even if adoption is 20% slower than planned (Bear case).",
        },
      ],
    },
  ],

  "prog-09-ds-certification": [
    {
      moduleNumber: 1,
      id: "dscert-m1",
      title: "Python Programming, Relational Databases & Analytical SQL Mastery",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master clean modular Python, functional data pipelines, normalized relational schemas (3NF), indexing strategies, and complex SQL joins.",
      keyConcepts: [
        "Python Data Structures: Dict/Set O(1) hash lookups vs. List O(n) scans, Generators & Comprehensions",
        "Database Normalization (1NF, 2NF, 3NF) & B-Tree vs. Hash Indexing",
        "SQL Execution Order: FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT",
        "Handling NULL semantics in SQL (COALESCE, NULLIF, IS NOT NULL)",
      ],
      lessonNotes: `Understanding SQL's logical order of execution explains why you cannot reference a SELECT alias inside a WHERE clause:
1. \`FROM / JOIN\` assembles the base tables
2. \`WHERE\` filters raw rows before aggregation
3. \`GROUP BY\` buckets rows into groups
4. \`HAVING\` filters aggregated groups
5. \`SELECT\` computes expressions and aliases (plus Window Functions)
6. \`ORDER BY\` & \`LIMIT\` sort and slice the final output.`,
      codeOrCaseExample: {
        title: "O(1) Hash-Join Lookup in Python vs Nested Loops",
        language: "python",
        snippet: `def join_candidates_to_departments(candidates: list[dict], departments: list[dict]) -> list[dict]:
    # Build O(1) lookup dictionary keyed by dept_id
    dept_map = {d["dept_id"]: d["dept_name"] for d in departments}
    return [
        {**c, "dept_name": dept_map.get(c["dept_id"], "Unassigned")}
        for c in candidates
    ]`,
        explanation: "Converting the lookup list into a dict reduces join complexity from O(N * M) nested loops to linear O(N + M).",
      },
      handsOnLab: {
        title: "Implement GroupBy-Having Aggregation Logic",
        taskDescription: "Group sales transactions by salesperson and return only those salespeople whose total sales exceed ₹1,00,000 and order count >= 3.",
        starterTemplate: `export function filterTopPerformers(orders: { rep: string; amount: number }[]) {
  const stats: Record<string, { total: number; count: number }> = {};
  for (const o of orders) {
    stats[o.rep] = stats[o.rep] || { total: 0, count: 0 };
    stats[o.rep].total += o.amount;
    stats[o.rep].count += 1;
  }
  return Object.entries(stats)
    .filter(([_, s]) => s.total >= 100000 && s.count >= 3)
    .map(([rep, s]) => ({ rep, ...s }));
}`,
        deliverableCriteria: "Aggregates totals and counts per key and applies post-aggregation HAVING filters.",
      },
      quizQuestions: [
        {
          question: "In SQL, what is the difference between the WHERE clause and the HAVING clause?",
          options: [
            "WHERE filters individual rows BEFORE GROUP BY aggregation; HAVING filters aggregated groups AFTER GROUP BY",
            "WHERE is only for numbers; HAVING is only for strings",
            "HAVING runs before FROM",
            "They are interchangeable in all queries",
          ],
          correctIndex: 0,
          explanation: "Aggregate functions like SUM() or COUNT() cannot be placed in WHERE; they are filtered post-aggregation in HAVING.",
        },
        {
          question: "What is the average time complexity of checking `x in my_set` (a Python set/dict) vs `x in my_list` (a Python list of N items)?",
          options: [
            "O(1) constant time for set/dict hash lookup vs. O(N) linear scan for list",
            "O(N^2) for set vs O(1) for list",
            "Both are O(log N)",
            "Both scan every element in memory",
          ],
          correctIndex: 0,
          explanation: "Sets and dictionaries use hash tables for O(1) average lookup.",
        },
        {
          question: "What does `SELECT COUNT(column_name)` return compared to `SELECT COUNT(*)` when `column_name` contains NULL values?",
          options: [
            "COUNT(column_name) counts only non-NULL values in that column, whereas COUNT(*) counts all rows including NULLs",
            "COUNT(column_name) throws a syntax error on NULLs",
            "Both return 0 if any NULL exists",
            "COUNT(*) skips NULL rows",
          ],
          correctIndex: 0,
          explanation: "SQL aggregate functions ignore NULL values except for COUNT(*).",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "dscert-m2",
      title: "Applied Statistics, Hypothesis Testing & Experimental Design",
      durationHours: "34 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master probability distributions (Normal, Binomial, Poisson), Z/t-tests, Chi-Square tests, Sample Size estimation, and Multiple Testing correction.",
      keyConcepts: [
        "Normal, Binomial (discrete trials), and Poisson (arrival rate) distributions",
        "Minimum Detectable Effect (MDE) & Sample Size calculation for A/B tests",
        "Bonferroni & Benjamini-Hochberg (FDR) corrections for multiple comparisons",
        "Simpson's Paradox & confounding variables in observational data",
      ],
      lessonNotes: `When running 20 independent hypothesis tests at alpha = 0.05, the probability of getting at least one False Positive by pure chance is:
\`1 - (0.95)^20 = 64.2%\`!
To prevent p-hacking and false discoveries:
1. Apply **Bonferroni Correction** (\`alpha_adjusted = alpha / num_tests\`) or **Benjamini-Hochberg False Discovery Rate (FDR)**.
2. Always pre-calculate required sample size based on Baseline Conversion Rate, Minimum Detectable Effect (MDE), alpha = 0.05, and Power (1 - beta) = 0.80 before peeking at experiment results.`,
      codeOrCaseExample: {
        title: "Bonferroni Multiple-Testing Correction & Z-Score Outlier Detector",
        language: "typescript",
        snippet: `export function evaluateMultipleHypotheses(pValues: number[], familyWiseAlpha = 0.05) {
  const m = Math.max(1, pValues.length);
  const bonferroniThreshold = familyWiseAlpha / m;
  return {
    bonferroniThreshold: Number(bonferroniThreshold.toFixed(5)),
    results: pValues.map((p, idx) => ({
      testIndex: idx + 1,
      pValue: p,
      significantAfterCorrection: p < bonferroniThreshold
    }))
  };
}`,
        explanation: "Dividing alpha by the number of simultaneous tests (m) controls the Family-Wise Error Rate (FWER).",
      },
      handsOnLab: {
        title: "Standardize Values into Z-Scores & Flag 3-Sigma Anomalies",
        taskDescription: "Given an array of numerical observations, compute mean, standard deviation, and return all values where |z-score| >= 3.0.",
        starterTemplate: `export function detectThreeSigmaAnomalies(values: number[]) {
  const mean = values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / Math.max(1, values.length);
  const std = Math.sqrt(variance) || 1;
  const anomalies = values.filter((v) => Math.abs((v - mean) / std) >= 3.0);
  return { mean: Number(mean.toFixed(2)), std: Number(std.toFixed(2)), anomalies };
}`,
        deliverableCriteria: "Computes population mean, standard deviation, and filters observations exceeding 3 standard deviations.",
      },
      quizQuestions: [
        {
          question: "Why is it dangerous to test 20 different metrics in an A/B test using an unadjusted alpha = 0.05 threshold?",
          options: [
            "Because the probability of observing at least one False Positive by random chance jumps to ~64% (Multiple Comparisons Problem)",
            "Because computers cannot run 20 t-tests",
            "Because p-values become negative",
            "Because sample size shrinks",
          ],
          correctIndex: 0,
          explanation: "Testing multiple hypotheses inflates family-wise Type I error unless corrected via Bonferroni or FDR.",
        },
        {
          question: "What is 'Simpson's Paradox' in data analysis?",
          options: [
            "A trend that appears in several individual groups reverses or disappears when those groups are combined due to a lurking confounding variable",
            "When the mean equals the median",
            "When a neural network has zero layers",
            "When SQL tables have primary keys",
          ],
          correctIndex: 0,
          explanation: "Always stratify by confounding variables (e.g., department size or patient severity) before drawing causal conclusions.",
        },
        {
          question: "Under a standard Normal (Gaussian) distribution, approximately what percentage of observations fall within +/- 2 standard deviations of the mean?",
          options: [
            "~95.4% (the 68–95–99.7 empirical rule)",
            "10%",
            "50%",
            "100%",
          ],
          correctIndex: 0,
          explanation: "By the empirical rule, ~68% fall within 1 sigma, ~95.4% within 2 sigma, and ~99.7% within 3 sigma.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "dscert-m3",
      title: "Machine Learning Algorithms, Feature Engineering & Model Explainability (SHAP)",
      durationHours: "40 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master Feature Encoding, Tree/Linear models, Hyperparameter Tuning (Optuna), and SHAP (SHapley Additive exPlanations) for regulated AI.",
      keyConcepts: [
        "Feature Encoding: One-Hot vs. Target Encoding (with out-of-fold smoothing) vs. cyclical sin/cos time features",
        "Bayesian Hyperparameter Optimization with Optuna vs. exhaustive GridSearch",
        "Model Explainability: Global & Local feature attribution using SHAP values",
        "Calibration of predicted probabilities (Platt Scaling / Isotonic Regression)",
      ],
      lessonNotes: `In regulated industries (BFSI credit underwriting, Healthcare triage, Recruitment ranking), a "black-box" prediction is unacceptable—you must explain *why* a specific prediction was made.
**SHAP (SHapley Additive exPlanations)** comes from cooperative game theory: for any individual prediction, the sum of all features' SHAP values equals the exact difference between the model's baseline average prediction and this specific individual's prediction!`,
      codeOrCaseExample: {
        title: "Local SHAP Additive Feature Attribution Breakdown",
        language: "typescript",
        snippet: `export function explainPredictionWithShap(baseValue: number, shapContributions: Record<string, number>) {
  const totalDelta = Object.values(shapContributions).reduce((a, b) => a + b, 0);
  const finalPrediction = baseValue + totalDelta;
  const sortedDrivers = Object.entries(shapContributions)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .map(([feature, impact]) => ({ feature, impact: Number(impact.toFixed(3)) }));

  return {
    baseValue,
    finalPrediction: Number(finalPrediction.toFixed(3)),
    topDrivers: sortedDrivers
  };
}`,
        explanation: "SHAP satisfies local accuracy: Base_Value + Sum(SHAP_i) = Final_Model_Output.",
      },
      handsOnLab: {
        title: "Encode Cyclical Time Features (Hour of Day) Using Sine & Cosine",
        taskDescription: "Convert an hour of day (0–23) into cyclical sin and cos coordinates so hour 23 and hour 0 are recognized as adjacent by distance-based ML models.",
        starterTemplate: `export function encodeCyclicalHour(hour: number) {
  const radians = (2 * Math.PI * hour) / 24;
  return {
    hour,
    sinHour: Number(Math.sin(radians).toFixed(4)),
    cosHour: Number(Math.cos(radians).toFixed(4))
  };
}`,
        deliverableCriteria: "Maps 0–23 onto the unit circle using 2*pi*hour/24 so 23:00 and 00:00 have minimal Euclidean distance.",
      },
      quizQuestions: [
        {
          question: "Why do we encode 'Hour of Day' (0–23) using Sine and Cosine transforms for linear/distance-based ML models?",
          options: [
            "Because raw integers treat 23:00 and 00:00 as 23 units apart instead of 1 hour apart; sin/cos preserves cyclical continuity",
            "Because neural networks only accept trigonometry",
            "To convert hours into years",
            "To delete night-time data",
          ],
          correctIndex: 0,
          explanation: "Projecting cyclical features (hours, days of week, months) onto a circle preserves true wrap-around proximity.",
        },
        {
          question: "What fundamental property do SHAP values guarantee when explaining an individual model prediction?",
          options: [
            "Additivity (Local Accuracy): The baseline average prediction plus the sum of each feature's SHAP contribution equals the exact model prediction for that instance",
            "SHAP values are always between 100 and 200",
            "SHAP only works on linear regression",
            "SHAP deletes correlated features",
          ],
          correctIndex: 0,
          explanation: "Rooted in Shapley game theory, SHAP fairly distributes the prediction delta across features with local accuracy.",
        },
        {
          question: "Why is Bayesian Optimization (Optuna) preferred over Grid Search when tuning 8+ hyperparameters?",
          options: [
            "Grid Search suffers from exponential combinatorics, whereas Bayesian Optimization uses past trial results to focus search on promising hyperparameter regions",
            "Grid Search is random",
            "Optuna requires zero training runs",
            "Grid Search cannot tune learning rates",
          ],
          correctIndex: 0,
          explanation: "Tree-structured Parzen Estimators (TPE) in Optuna converge to optimal hyperparameters in a fraction of the trials.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "dscert-m4",
      title: "Time-Series Forecasting & Recommender Systems",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Build ARIMA/Prophet/XGBoost time-series forecasters (with walk-forward validation) and Collaborative + Content-Based Recommender engines.",
      keyConcepts: [
        "Time-Series Walk-Forward Cross-Validation (TimeSeriesSplit — never shuffle future into past!)",
        "Autocorrelation (ACF / PACF), Stationarity (ADF Test) & Lag Features",
        "Recommender Systems: Content-Based Filtering vs. Collaborative Filtering (Matrix Factorization)",
        "Solving the Cold-Start Problem for new users and new job postings",
      ],
      lessonNotes: `The #1 mistake in Time-Series forecasting is using random K-Fold Cross-Validation.
Shuffling time-series data randomly leaks future tomorrow prices/sales into yesterday's training set!
Always use **Walk-Forward Validation (` + "`TimeSeriesSplit`" + `)** where the training window strictly precedes the validation window in chronological time.`,
      codeOrCaseExample: {
        title: "Hybrid Job Recommender: Content Cosine + Collaborative Boost",
        language: "typescript",
        snippet: `export function scoreJobRecommendation(
  candidateSkills: string[],
  jobRequiredSkills: string[],
  peerBookmarkRate: number
) {
  const candSet = new Set(candidateSkills.map((s) => s.toLowerCase()));
  const matched = jobRequiredSkills.filter((s) => candSet.has(s.toLowerCase())).length;
  const contentOverlap = jobRequiredSkills.length > 0 ? matched / jobRequiredSkills.length : 0;

  // Hybrid 75% Content Skill Fit + 25% Collaborative Peer Popularity
  const hybridScore = contentOverlap * 0.75 + peerBookmarkRate * 0.25;
  return {
    contentMatchPct: Math.round(contentOverlap * 100),
    hybridScorePct: Math.round(hybridScore * 100)
  };
}`,
        explanation: "Blending content skill overlap with collaborative interaction signals solves the cold-start problem while improving ranking quality.",
      },
      handsOnLab: {
        title: "Compute MAPE (Mean Absolute Percentage Error) for Demand Forecasts",
        taskDescription: "Implement MAPE = mean(|Actual - Forecast| / Actual) * 100 to evaluate forecast accuracy across a product line.",
        starterTemplate: `export function calculateMAPE(actuals: number[], forecasts: number[]): number {
  let sumPctErr = 0;
  const n = Math.min(actuals.length, forecasts.length);
  for (let i = 0; i < n; i++) {
    sumPctErr += Math.abs(actuals[i] - forecasts[i]) / Math.max(1, Math.abs(actuals[i]));
  }
  return n > 0 ? Number(((sumPctErr / n) * 100).toFixed(2)) : 0;
}`,
        deliverableCriteria: "Computes mean absolute percentage error safely across actual and forecast arrays.",
      },
      quizQuestions: [
        {
          question: "Why must you NEVER use random shuffled K-Fold Cross-Validation on a Time-Series forecasting dataset?",
          options: [
            "Because it causes look-ahead data leakage by training the model on future timestamps to predict past timestamps",
            "Because time-series data has no numbers",
            "Because K-Fold only works on images",
            "Because dates cannot be sorted",
          ],
          correctIndex: 0,
          explanation: "Time-series models must be evaluated with chronological Walk-Forward / Expanding Window splits.",
        },
        {
          question: "What is the 'Cold-Start Problem' in Collaborative Filtering recommender systems, and how is it solved?",
          options: [
            "New users or new items have zero interaction history; solved by hybridizing with Content-Based features and onboarding preferences",
            "Servers running in cold data centers",
            "Database connections timing out",
            "Python taking 1 second to import",
          ],
          correctIndex: 0,
          explanation: "Pure collaborative filtering relies on past user-item interactions; content metadata bridges the gap for brand-new items.",
        },
        {
          question: "What does a stationary time series mean in statistical forecasting (ARIMA)?",
          options: [
            "Its statistical properties (mean, variance, autocorrelation) remain constant over time without an upward/downward trend",
            "Every value in the dataset is zero",
            "The data is stored on paper stationery",
            "The series only has 2 data points",
          ],
          correctIndex: 0,
          explanation: "Differencing (subtracting y_{t-1} from y_t) removes trends to make a non-stationary series stationary.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "dscert-m5",
      title: "End-to-End Industry Capstone & Professional Certification Assessment",
      durationHours: "34 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Deliver a full-lifecycle Data Science Capstone from business problem framing and ETL to SHAP explainability, API deployment, and executive presentation.",
      keyConcepts: [
        "Reproducible Project Structure: Cookiecutter DS, Git version control, virtual environments",
        "Model Card documentation: Intended use, evaluation slices, fairness & limitations",
        "Automated Unit Tests for data transformations (pytest)",
        "Final Capstone Defense & Recruits.org.in Global Certification Verification",
      ],
      lessonNotes: `To earn your **Globally Recognized Data Science Professional Certification** from **Recruits.org.in (Quench Research Labs Private Limited • Powered by arohiai.com)**, your capstone must pass four production gates:
1. Zero data leakage in preprocessing & validation splits.
2. Quantified improvement over a simple baseline heuristic.
3. Subgroup fairness & SHAP explainability audit.
4. Deployed API endpoint with automated unit tests.`,
      codeOrCaseExample: {
        title: "Model Card & Subgroup Fairness Audit Generator",
        language: "typescript",
        snippet: `export function auditModelFairnessDisparateImpact(
  groupAPositiveRate: number,
  groupBPositiveRate: number
) {
  const minRate = Math.min(groupAPositiveRate, groupBPositiveRate);
  const maxRate = Math.max(groupAPositiveRate, groupBPositiveRate, 0.0001);
  const disparateImpactRatio = minRate / maxRate;
  // Four-Fifths (80%) Rule standard in hiring/credit fairness audits
  return {
    disparateImpactRatio: Number(disparateImpactRatio.toFixed(3)),
    passesFourFifthsRule: disparateImpactRatio >= 0.8
  };
}`,
        explanation: "The Four-Fifths (0.80) Rule checks that the selection rate for any protected subgroup is at least 80% of the highest group's rate.",
      },
      handsOnLab: {
        title: "Verify Baseline Lift Before Promoting a Capstone Model",
        taskDescription: "Compare a candidate ML model's ROC-AUC and latency against the production baseline; approve promotion only if AUC improves by >= 0.02 and p95 latency <= 150ms.",
        starterTemplate: `export function evaluateModelPromotionGate(baselineAuc: number, newModelAuc: number, p95LatencyMs: number) {
  const aucLift = Number((newModelAuc - baselineAuc).toFixed(4));
  const promote = aucLift >= 0.02 && p95LatencyMs <= 150;
  return { aucLift, p95LatencyMs, promote };
}`,
        deliverableCriteria: "Enforces both statistical quality lift (>= 0.02 AUC) and production latency SLA (<= 150ms).",
      },
      quizQuestions: [
        {
          question: "Why should every Data Science project benchmark against a simple Baseline Heuristic first before building deep ensembles?",
          options: [
            "To verify that complex ML engineering actually delivers meaningful accuracy/business lift over a fast, simple baseline",
            "Because baselines are slower to run",
            "Because stakeholders dislike simple comparisons",
            "To skip testing",
          ],
          correctIndex: 0,
          explanation: "If a 50-layer neural network beats a 3-line logistic regression baseline by only 0.01% while taking 500ms longer, the simpler model wins.",
        },
        {
          question: "What is the 'Four-Fifths (80%) Rule' used for in Algorithmic Fairness audits?",
          options: [
            "Verifying that the positive selection rate for any demographic subgroup is at least 80% of the highest-selected group's rate",
            "Splitting data 80% train and 20% test",
            "Using 80% Digital and 20% Physical tutoring",
            "Compressing files by 80%",
          ],
          correctIndex: 0,
          explanation: "A Disparate Impact Ratio below 0.80 flags potential algorithmic bias in credit or hiring models.",
        },
        {
          question: "What is a 'Model Card' in enterprise AI governance?",
          options: [
            "Standardized documentation detailing a model's training data, intended use cases, subgroup performance metrics, and known limitations",
            "A physical GPU graphics card",
            "A business card for data scientists",
            "A CSS UI component",
          ],
          correctIndex: 0,
          explanation: "Model Cards provide transparency for auditors, engineers, and product leaders.",
        },
      ],
    },
  ],

  "prog-10-ds-engineers": [
    {
      moduleNumber: 1,
      id: "dseng-m1",
      title: "High-Performance Python, Data Structures, Algorithms & Numerical Computing",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master algorithmic complexity (Big-O), memory profiling, multiprocessing/asyncio, Numba JIT compilation, and sparse matrix representations.",
      keyConcepts: [
        "Time & Space Complexity: Hash Tables, Heaps (Priority Queues), Graphs & Dynamic Programming",
        "Python GIL (Global Interpreter Lock): Multiprocessing (CPU-bound) vs. Asyncio (I/O-bound)",
        "CSR (Compressed Sparse Row) matrices for high-dimensional feature spaces",
        "Profiling bottlenecks with cProfile and memory_profiler",
      ],
      lessonNotes: `Engineers building production ML systems must distinguish between **I/O-bound** and **CPU-bound** workloads in Python:
- Because of the CPython Global Interpreter Lock (GIL), standard threads do not execute Python bytecode in parallel across CPU cores.
- Use \`asyncio\` for high-concurrency **I/O-bound** tasks (calling 100 microservices/LLMs).
- Use \`multiprocessing\`, C++/Rust extensions, or vectorized NumPy/PyTorch (which release the GIL in C/CUDA) for **CPU-bound** matrix math.`,
      codeOrCaseExample: {
        title: "Top-K Feature Importance Selector Using Min-Heap Strategy",
        language: "typescript",
        snippet: `export function selectTopKFeatures(features: { name: string; score: number }[], k: number) {
  return [...features]
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}`,
        explanation: "Selecting top-K elements efficiently avoids materializing unneeded low-weight features in downstream inference.",
      },
      handsOnLab: {
        title: "Compress a Sparse Vector into Non-Zero Index/Value Pairs",
        taskDescription: "Write a sparse vector encoder that converts a dense array containing mostly zeros into compact { index, value } pairs and calculates compression ratio.",
        starterTemplate: `export function encodeSparseVector(dense: number[]) {
  const nonZero: { index: number; value: number }[] = [];
  dense.forEach((val, idx) => {
    if (val !== 0) nonZero.push({ index: idx, value: val });
  });
  return {
    originalLength: dense.length,
    nonZeroCount: nonZero.length,
    sparsityPercent: Number((((dense.length - nonZero.length) / Math.max(1, dense.length)) * 100).toFixed(1)),
    entries: nonZero
  };
}`,
        deliverableCriteria: "Stores only non-zero indices/values and computes percentage sparsity.",
      },
      quizQuestions: [
        {
          question: "In Python, why do you use `multiprocessing` (or C/NumPy extensions) instead of `threading` for heavy CPU-bound numerical loops?",
          options: [
            "Because the CPython Global Interpreter Lock (GIL) allows only one thread to execute Python bytecode at a time per process",
            "Because threads cannot read variables",
            "Because multiprocessing uses zero RAM",
            "Because threading only works on Windows",
          ],
          correctIndex: 0,
          explanation: "Multiprocessing spawns separate OS processes each with its own Python interpreter and GIL, utilizing all CPU cores.",
        },
        {
          question: "Why are Sparse Matrices (e.g., CSR format) essential when storing TF-IDF or high-cardinality one-hot features with 100,000 columns?",
          options: [
            "Because 99%+ of entries are zero; storing only non-zero indices and values reduces RAM usage by 50x–100x and speeds up dot products",
            "Because dense arrays cannot hold zeros",
            "Because sparse matrices sort rows alphabetically",
            "To convert numbers into images",
          ],
          correctIndex: 0,
          explanation: "Sparse representations skip storing and multiplying millions of zeroes.",
        },
        {
          question: "What is the time complexity of finding the top K largest elements from a stream of N items using a Min-Heap of size K?",
          options: [
            "O(N log K)",
            "O(N^2)",
            "O(2^N)",
            "O(N!)",
          ],
          correctIndex: 0,
          explanation: "Maintaining a Min-Heap of size K takes O(log K) per insertion across N items, beating full O(N log N) sorting when K << N.",
        },
      ],
    },
    {
      moduleNumber: 2,
      id: "dseng-m2",
      title: "Mathematical Foundations of ML (Linear Algebra, Calculus & Convex Optimization)",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Master Eigenvalues, Singular Value Decomposition (SVD), PCA math, Jacobian/Hessian gradients, and Stochastic Gradient Descent optimization.",
      keyConcepts: [
        "Matrix Multiplication, Orthogonality, Eigenvalues & Eigenvectors",
        "Singular Value Decomposition (SVD) & Principal Component Analysis (PCA) covariance projection",
        "Multivariable Calculus: Partial Derivatives, Gradients, Chain Rule & Hessian curvature",
        "Convex vs. Non-Convex Loss landscapes & Momentum/Adam adaptive step sizes",
      ],
      lessonNotes: `Every Machine Learning algorithm is an optimization problem in linear algebra and calculus:
- **PCA (Principal Component Analysis)** computes the eigenvectors of the feature Covariance Matrix \`C = (1/n) X^T X\`. The eigenvector with the largest eigenvalue points in the direction of maximum variance!
- **Gradient Descent** updates parameters in the opposite direction of the gradient:
\`theta_{t+1} = theta_t - learning_rate * grad(L(theta_t))\`.`,
      codeOrCaseExample: {
        title: "Numerical Gradient Descent Optimizer Step",
        language: "typescript",
        snippet: `// Minimize f(w) = (w - 5)^2, where derivative df/dw = 2 * (w - 5)
export function runGradientDescentSteps(initialWeight = 0, learningRate = 0.2, steps = 10) {
  let w = initialWeight;
  const history: { step: number; weight: number; loss: number }[] = [];
  for (let i = 1; i <= steps; i++) {
    const grad = 2 * (w - 5);
    w = w - learningRate * grad;
    const loss = Math.pow(w - 5, 2);
    history.push({ step: i, weight: Number(w.toFixed(4)), loss: Number(loss.toFixed(4)) });
  }
  return { convergedWeight: Number(w.toFixed(4)), finalLoss: history[history.length - 1].loss, history };
}`,
        explanation: "Stepping opposite the gradient (w = w - lr * grad) drives the loss (w - 5)^2 exponentially toward zero as w converges to 5.",
      },
      handsOnLab: {
        title: "Compute Matrix Dot Product & L2 Frobenius Norm",
        taskDescription: "Write a vector dot product and L2 Euclidean norm calculator used in cosine similarity and ridge regularization.",
        starterTemplate: `export function vectorDotAndNorm(a: number[], b: number[]) {
  let dot = 0;
  let sumSqA = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * (b[i] || 0);
    sumSqA += a[i] * a[i];
  }
  return { dotProduct: Number(dot.toFixed(4)), l2NormA: Number(Math.sqrt(sumSqA).toFixed(4)) };
}`,
        deliverableCriteria: "Computes exact inner product sum(a_i * b_i) and Euclidean L2 norm sqrt(sum(a_i^2)).",
      },
      quizQuestions: [
        {
          question: "In Principal Component Analysis (PCA), what do the eigenvalues of the covariance matrix represent?",
          options: [
            "The magnitude of variance captured along each corresponding orthogonal eigenvector (principal component)",
            "The number of missing values in each row",
            "The learning rate of the neural network",
            "The file size in megabytes",
          ],
          correctIndex: 0,
          explanation: "Sorting eigenvectors by descending eigenvalue lets us keep the top K components that explain 95%+ of total variance.",
        },
        {
          question: "What happens during Gradient Descent if the learning rate is set far too high?",
          options: [
            "The weight updates overshoot the minimum, causing the loss to oscillate wildly and diverge to infinity (NaN)",
            "The model converges more accurately",
            "Training stops using the CPU",
            "Gradients become zero immediately",
          ],
          correctIndex: 0,
          explanation: "When step size exceeds 2 / lambda_max of the Hessian, updates bounce across the valley with increasing amplitude.",
        },
        {
          question: "Which calculus rule is the mathematical backbone of Backpropagation in multi-layer neural networks?",
          options: [
            "The Chain Rule of derivatives (multiplying local Jacobian gradients layer by layer from output to input)",
            "L'Hopital's limit rule",
            "Integration by parts",
            "Pythagorean theorem",
          ],
          correctIndex: 0,
          explanation: "Backpropagation applies the Chain Rule in reverse topological order to compute dLoss/dWeight for every layer.",
        },
      ],
    },
    {
      moduleNumber: 3,
      id: "dseng-m3",
      title: "Scalable Machine Learning Systems, Feature Stores & Distributed Training",
      durationHours: "38 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Eliminate training-serving skew using Dual-Storage Feature Stores (Feast/Redis + Parquet), Data Parallel DDP training, and Approximate Nearest Neighbors (HNSW).",
      keyConcepts: [
        "Training-Serving Skew & Point-in-Time Correct Joins (preventing time-travel leakage)",
        "Feature Store Architecture: Offline Store (BigQuery/Snowflake for batch training) + Online Store (Redis/DynamoDB for <10ms inference)",
        "Distributed Training: Data Parallelism (DDP AllReduce) vs. Model/Tensor Parallelism",
        "ANN Vector Indexing: HNSW (Hierarchical Navigable Small World) & IVF-PQ",
      ],
      lessonNotes: `One of the deadliest bugs in production ML Engineering is **Training-Serving Skew**:
- During offline training, a feature is computed using a batch SQL query; during online live traffic, a software engineer rewrites that logic in Java/TypeScript with subtle differences.
A **Feature Store** solves this by defining feature transformations once and syncing them to both an **Offline Store** (for point-in-time historical training) and a low-latency **Online Key-Value Store (Redis)** for <5ms real-time serving.`,
      codeOrCaseExample: {
        title: "Point-in-Time Correct Feature Join (Anti-Time-Travel Leakage)",
        language: "typescript",
        snippet: `export function pointInTimeFeatureLookup(
  applicationTimestampMs: number,
  historicalSnapshots: { updatedAtMs: number; featureVal: number }[]
) {
  // Only consider feature snapshots recorded ON OR BEFORE the application timestamp!
  const validPast = historicalSnapshots
    .filter((s) => s.updatedAtMs <= applicationTimestampMs)
    .sort((a, b) => b.updatedAtMs - a.updatedAtMs);

  return validPast.length > 0 ? validPast[0].featureVal : null;
}`,
        explanation: "Filtering s.updatedAtMs <= applicationTimestampMs guarantees that future feature values never leak into historical training examples.",
      },
      handsOnLab: {
        title: "Simulate Online Feature Store Cache Lookup with Fallback",
        taskDescription: "Implement an online feature fetcher that checks an in-memory Redis-like map first, logs cache hit latency (~2ms) vs fallback compute latency (~45ms), and returns the feature vector.",
        starterTemplate: `export function fetchOnlineFeatures(entityId: string, redisCache: Record<string, number[]>) {
  if (redisCache[entityId]) {
    return { source: "ONLINE_REDIS_CACHE", latencyMs: 2, vector: redisCache[entityId] };
  }
  return { source: "FALLBACK_ON_DEMAND_COMPUTE", latencyMs: 45, vector: [0.0, 0.0, 0.0] };
}`,
        deliverableCriteria: "Returns cached vector in 2ms on hit and falls back gracefully on cache miss.",
      },
      quizQuestions: [
        {
          question: "Why does a Feature Store use two separate storage engines: an Offline Store (Parquet/Warehouse) and an Online Store (Redis/Key-Value)?",
          options: [
            "Offline stores handle high-throughput batch scans for training millions of rows, while Online stores deliver <10ms point lookups by entity ID during live user requests",
            "Because Redis cannot store numbers",
            "To double cloud costs unnecessarily",
            "Because Parquet files delete themselves after 1 hour",
          ],
          correctIndex: 0,
          explanation: "Columnar warehouses have 500ms–2s query startup overhead (unsuitable for real-time API calls), whereas Redis provides ~1–5ms key-value reads.",
        },
        {
          question: "What is a 'Point-in-Time Correct Join' (ASOF Join) when building historical training datasets?",
          options: [
            "Joining each historical label event with the latest feature value that existed AT OR BEFORE that event's exact timestamp, preventing future data leakage",
            "Joining tables without any WHERE clause",
            "Using today's current feature values for events that happened 2 years ago",
            "Joining only at midnight",
          ],
          correctIndex: 0,
          explanation: "Using current feature snapshots on historical labels leaks future outcomes into training.",
        },
        {
          question: "How does Distributed Data Parallel (DDP) training synchronize model weights across 8 GPUs?",
          options: [
            "Each GPU computes gradients on its own mini-batch shard, then an AllReduce ring communication step averages gradients across all GPUs before updating weights",
            "Only GPU 0 does work while GPUs 1–7 stay turned off",
            "GPUs email weights to each other via SMTP",
            "Weights are never synchronized",
          ],
          correctIndex: 0,
          explanation: "Ring-AllReduce aggregates gradients across GPUs with bandwidth overhead independent of cluster size.",
        },
      ],
    },
    {
      moduleNumber: 4,
      id: "dseng-m4",
      title: "Low-Latency Model Serving, ONNX Quantization & GPU Inference Optimization",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Cut inference latency and memory by 4x using FP16/INT8 quantization, ONNX Runtime, dynamic request batching, and Triton Inference Server.",
      keyConcepts: [
        "Model Quantization: FP32 (4 bytes) -> FP16/BF16 (2 bytes) -> INT8 (1 byte) memory & throughput gains",
        "Cross-framework acceleration with ONNX Runtime & TensorRT graph fusion",
        "Dynamic Batching: Grouping concurrent incoming HTTP requests into a single GPU tensor pass",
        "Shadow Deployments (Dark Launching) vs. A/B Testing in production",
      ],
      lessonNotes: `In high-scale engineering systems (e.g., ranking 500 job candidates in < 50ms):
1. **Quantization**: Converting weights from 32-bit floats (FP32) to 8-bit integers (INT8) reduces model memory footprint by **75% (4x smaller)** and speeds up CPU/GPU SIMD matrix multiplication by **2x–4x** with < 0.5% accuracy drop.
2. **Dynamic Batching**: Waiting 3ms at the inference gateway to batch 16 individual user requests into a single \`(16, D)\` matrix pass utilizes GPU tensor cores 10x more efficiently than running 16 sequential \`(1, D)\` calls.`,
      codeOrCaseExample: {
        title: "Model Quantization Memory & Throughput Estimator",
        language: "typescript",
        snippet: `export function estimateQuantizationGains(parameterCountMillions: number) {
  const fp32SizeMB = parameterCountMillions * 4; // 4 bytes per param
  const fp16SizeMB = parameterCountMillions * 2; // 2 bytes per param
  const int8SizeMB = parameterCountMillions * 1; // 1 byte per param
  const int4SizeMB = parameterCountMillions * 0.5; // 0.5 bytes per param

  return {
    fp32SizeMB,
    fp16SizeMB,
    int8SizeMB,
    int4SizeMB,
    memorySavedInt8Percent: 75
  };
}`,
        explanation: "A 7-Billion parameter model (7,000M params) requires 28,000 MB (28 GB) in FP32, 14 GB in FP16, and just 7 GB in INT8.",
      },
      handsOnLab: {
        title: "Simulate INT8 Symmetric Linear Quantization & Dequantization",
        taskDescription: "Quantize a floating-point weight array into INT8 [-127, 127] using scale = max(|w|) / 127, and compute reconstruction error.",
        starterTemplate: `export function quantizeInt8Symmetric(weights: number[]) {
  const maxAbs = Math.max(...weights.map(Math.abs), 1e-6);
  const scale = maxAbs / 127;
  const int8Weights = weights.map((w) => Math.round(w / scale));
  const dequantized = int8Weights.map((q) => Number((q * scale).toFixed(4)));
  return { scale: Number(scale.toFixed(6)), int8Weights, dequantized };
}`,
        deliverableCriteria: "Maps float weights into signed 8-bit integers [-127, 127] and reconstructs approximate floats via the scale factor.",
      },
      quizQuestions: [
        {
          question: "How much GPU/RAM memory is required to store the weights of a 7-Billion (7B) parameter model in FP32 vs INT8?",
          options: [
            "~28 GB in FP32 (4 bytes/param) vs ~7 GB in INT8 (1 byte/param) — a 4x memory reduction",
            "7 MB in both formats",
            "100 TB in INT8",
            "INT8 uses 4x more memory than FP32",
          ],
          correctIndex: 0,
          explanation: "Each parameter takes 32 bits (4 bytes) in FP32 and 8 bits (1 byte) in INT8.",
        },
        {
          question: "What is 'Dynamic Batching' in an ML inference server (such as Triton)?",
          options: [
            "Grouping multiple concurrent individual prediction requests arriving within a few milliseconds into a single batched GPU forward pass to maximize throughput",
            "Training the model once a month",
            "Deleting slow requests",
            "Running inference in the user's CSS stylesheet",
          ],
          correctIndex: 0,
          explanation: "GPUs excel at parallel matrix multiplication; batching requests amortizes kernel launch and memory bandwidth overhead.",
        },
        {
          question: "What is a 'Shadow Deployment' (Dark Launch) when testing a new ML model v2?",
          options: [
            "Mirroring live production requests to Model v2 asynchronously in the background and logging its predictions without showing them to users yet",
            "Deploying only at midnight",
            "Turning off all logging",
            "Deleting Model v1 immediately without testing",
          ],
          correctIndex: 0,
          explanation: "Shadow mode validates live latency, stability, and prediction distribution on real traffic with zero user risk.",
        },
      ],
    },
    {
      moduleNumber: 5,
      id: "dseng-m5",
      title: "Engineering Domain AI Capstone (Predictive Maintenance, IoT, FinTech & Systems)",
      durationHours: "36 Hours",
      deliverySplit: "80% Digital LMS + 20% Physical Lab",
      summary: "Architect an end-to-end engineering AI system combining sensor/telemetry anomaly detection, Remaining Useful Life (RUL) estimation, and resilient microservices.",
      keyConcepts: [
        "Industrial IoT & Telemetry Processing: Vibration FFT spectra, temperature & pressure anomalies",
        "Remaining Useful Life (RUL) survival & degradation modeling for predictive maintenance",
        "High-Throughput System Design: Circuit Breakers, Rate Limiters & Dead-Letter Queues",
        "Engineering Capstone Defense & MNC Placement Readiness",
      ],
      lessonNotes: `Whether you come from **CSE, ECE, Electrical, Mechanical, Civil, or Industrial Engineering**, combining domain physics/telemetry with Data Science makes you uniquely valuable to top R&D and Core MNCs:
- **Unplanned Downtime** in a manufacturing plant, power grid, or cloud cluster costs millions per hour.
- By fusing real-time sensor telemetry (temperature, vibration RMS, current draw) into an Anomaly Detection + Remaining Useful Life (RUL) pipeline, engineers schedule maintenance proactively before catastrophic failure occurs.`,
      codeOrCaseExample: {
        title: "Industrial IoT Predictive Maintenance & Remaining Useful Life (RUL) Engine",
        language: "typescript",
        snippet: `export function assessEquipmentHealth(telemetry: {
  vibrationMmPerSec: number;
  bearingTempCelsius: number;
  operatingHours: number;
}) {
  const vibScore = Math.max(0, (telemetry.vibrationMmPerSec - 2.5) * 18);
  const tempScore = Math.max(0, (telemetry.bearingTempCelsius - 65) * 1.5);
  const wearScore = telemetry.operatingHours * 0.005;

  const degradationIndex = Math.min(100, Math.round(vibScore + tempScore + wearScore));
  const estimatedRulHours = Math.max(0, Math.round((100 - degradationIndex) * 12));

  return {
    degradationIndex,
    estimatedRulHours,
    maintenanceAlert:
      degradationIndex >= 75
        ? "CRITICAL: Schedule Bearing Replacement Within 48 Hours"
        : degradationIndex >= 45
        ? "WARNING: Inspect Lubrication & Alignment at Next Shift"
        : "NOMINAL: Healthy Operation"
  };
}`,
        explanation: "Combining multi-sensor thresholds (ISO 10816 vibration velocity + thermal rise) estimates Remaining Useful Life and triggers preventive work orders.",
      },
      handsOnLab: {
        title: "Implement a Microservice Circuit Breaker for ML Inference Resilience",
        taskDescription: "Write a Circuit Breaker state evaluator that trips to OPEN when consecutive failures >= 5, protecting downstream services from cascading timeouts.",
        starterTemplate: `export function evaluateCircuitBreaker(consecutiveFailures: number, failureThreshold = 5) {
  if (consecutiveFailures >= failureThreshold) {
    return { state: "OPEN_FAST_FAIL", useFallbackHeuristic: true };
  }
  return { state: "CLOSED_HEALTHY", useFallbackHeuristic: false };
}`,
        deliverableCriteria: "Trips circuit breaker to OPEN state when failure threshold is reached and activates deterministic fallback heuristic.",
      },
      quizQuestions: [
        {
          question: "In Industrial & Systems AI, what is the primary advantage of Predictive Maintenance (RUL modeling) over Preventive (calendar-based) Maintenance?",
          options: [
            "It predicts impending failure from real-time sensor degradation, avoiding both unexpected breakdowns AND wasteful early replacement of healthy parts",
            "It waits until machines explode before fixing them",
            "It replaces parts every single day regardless of condition",
            "It requires no sensors",
          ],
          correctIndex: 0,
          explanation: "Condition-based predictive maintenance maximizes component lifespan while preventing catastrophic unplanned downtime.",
        },
        {
          question: "What is the role of the 'Circuit Breaker' pattern when calling an ML microservice from a core checkout or industrial control pipeline?",
          options: [
            "If the ML service starts timing out repeatedly, the Circuit Breaker trips OPEN and immediately returns a fast fallback heuristic instead of hanging the entire system",
            "It physically cuts power to the data center",
            "It deletes the database",
            "It increases network latency",
          ],
          correctIndex: 0,
          explanation: "Circuit breakers prevent cascading thread-pool exhaustion and guarantee graceful degradation.",
        },
        {
          question: "Why is Fast Fourier Transform (FFT) feature extraction widely used on vibration and acoustic sensor signals in Engineering Data Science?",
          options: [
            "It converts noisy time-domain waveforms into frequency-domain spectra, isolating specific bearing/gear fault harmonic frequencies",
            "It converts audio into SQL tables",
            "It deletes high frequencies",
            "It only works on text strings",
          ],
          correctIndex: 0,
          explanation: "Mechanical defects (outer race bearing wear, shaft misalignment) manifest as distinct peaks at characteristic frequencies in the FFT spectrum.",
        },
      ],
    },
  ],
};
