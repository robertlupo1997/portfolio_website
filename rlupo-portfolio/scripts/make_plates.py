"""Generate Void-palette project plates from real model runs and metrics."""
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

OUT = '/home/tlupo/projects/portfolio_website/rlupo-portfolio/public/assets'

# ---- The Invisible Frame plate style ----
VOID = '#0A0A0B'
SURFACE = '#111113'
TEXT_BRIGHT = '#E8E8EE'
TEXT_MID = '#888899'
TEXT_QUIET = '#7A7A8C'
GRID = (1, 1, 1, 0.07)

plt.rcParams.update({
    'figure.facecolor': VOID,
    'axes.facecolor': VOID,
    'savefig.facecolor': VOID,
    'text.color': TEXT_MID,
    'axes.edgecolor': (1, 1, 1, 0.15),
    'axes.labelcolor': TEXT_QUIET,
    'xtick.color': TEXT_QUIET,
    'ytick.color': TEXT_QUIET,
    'font.family': 'monospace',
    'font.monospace': ['DejaVu Sans Mono'],
    'font.size': 11,
    'axes.grid': True,
    'grid.color': GRID,
    'grid.linewidth': 0.6,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.spines.left': False,
    'axes.linewidth': 0.8,
})

def save(fig, name, left=0.20, right=0.88, top=0.80, bottom=0.22):
    # safe-area composition: chart sits in the central ~60%, void bleed
    # absorbs object-fit cover crops and parallax drift on the site
    fig.subplots_adjust(left=left, right=right, top=top, bottom=bottom)
    fig.savefig(f'{OUT}/{name}', dpi=150)
    plt.close(fig)
    print('wrote', name)

# ============================================================
# FerroML — hue: electric blue
# ============================================================
F_HUE = '#4D8DFF'
F_HUE_DIM = '#2A4D8C'

# --- Plate 1: real 10-fold CV model comparison (run live) ---
from sklearn.datasets import make_classification
from sklearn.model_selection import StratifiedKFold
from ferroml.linear import LogisticRegression
from ferroml.neighbors import KNeighborsClassifier
from ferroml.trees import RandomForestClassifier, GradientBoostingClassifier

X, y = make_classification(
    n_samples=300, n_features=20, n_informative=8,
    n_redundant=4, n_clusters_per_class=2,
    flip_y=0.10, random_state=42,
)
y = y.astype(np.float64)

models = {
    'logistic regression': lambda: LogisticRegression(),
    'knn (k=5)': lambda: KNeighborsClassifier(n_neighbors=5),
    'random forest': lambda: RandomForestClassifier(n_estimators=100, random_state=42),
    'gradient boosting': lambda: GradientBoostingClassifier(n_estimators=100, random_state=42),
}

skf = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
results = {}
for name, factory in models.items():
    scores = []
    for tr, te in skf.split(X, y):
        m = factory()
        m.fit(X[tr], y[tr])
        scores.append((m.predict(X[te]) == y[te]).mean())
    results[name] = np.array(scores)
    print(f'{name}: {np.mean(scores):.3f}')

fig, ax = plt.subplots(figsize=(16, 9))
names = list(results.keys())
rng = np.random.default_rng(7)
for i, name in enumerate(names):
    s = results[name]
    mean, sd = s.mean(), s.std(ddof=1)
    ci = 1.96 * sd / np.sqrt(len(s))
    # fold scores, jittered
    ax.scatter(s, np.full_like(s, i) + rng.uniform(-0.08, 0.08, len(s)),
               s=26, color=F_HUE, alpha=0.45, linewidths=0)
    # 95% CI band
    ax.plot([mean - ci, mean + ci], [i, i], color=F_HUE, linewidth=3, solid_capstyle='round')
    ax.plot(mean, i, 'o', color=TEXT_BRIGHT, markersize=7, zorder=5)
    ax.annotate(f'{mean:.3f}', (mean, i), xytext=(0, 14), textcoords='offset points',
                ha='center', color=TEXT_BRIGHT, fontsize=11)
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, fontsize=12, color=TEXT_MID)
ax.set_xlabel('accuracy · 10-fold stratified cv · 95% ci', labelpad=12)
ax.grid(axis='y', visible=False)
ax.set_ylim(-0.6, len(names) - 0.4)
ax.invert_yaxis()
save(fig, 'plate-ferroml-comparison.png')

# --- Plate 2: prediction intervals with an extrapolation gap (run live) ---
from ferroml.linear import LinearRegression

np.random.seed(42)
true_f = lambda x: 2.0 * x + 1.5 * np.sin(x)
x_tr = np.sort(np.concatenate([np.random.uniform(0, 3, 15), np.random.uniform(6, 9, 15)]))
y_tr = true_f(x_tr) + np.random.normal(0, 0.5, len(x_tr))
x_plot = np.linspace(-0.5, 9.5, 300)

lr = LinearRegression()
lr.fit(x_tr.reshape(-1, 1), y_tr)
_, lo95, hi95 = lr.predict_interval(x_plot.reshape(-1, 1), level=0.95)
_, lo80, hi80 = lr.predict_interval(x_plot.reshape(-1, 1), level=0.80)
y_hat = lr.predict(x_plot.reshape(-1, 1))

fig, ax = plt.subplots(figsize=(16, 9))
ax.fill_between(x_plot, lo95, hi95, color=F_HUE, alpha=0.10, linewidth=0)
ax.fill_between(x_plot, lo80, hi80, color=F_HUE, alpha=0.18, linewidth=0)
ax.plot(x_plot, y_hat, color=F_HUE, linewidth=2)
ax.scatter(x_tr, y_tr, s=30, color=TEXT_BRIGHT, zorder=5, linewidths=0)
ax.annotate('95% interval', (x_plot[265], hi95[265]), xytext=(0, 10),
            textcoords='offset points', color=TEXT_QUIET, fontsize=10, ha='center')
ax.set_xlabel('prediction intervals on every estimate · ferroml.LinearRegression', labelpad=12)
ax.set_yticks([])
save(fig, 'plate-ferroml-intervals.png')

# ============================================================
# KKBOX — hue: violet
# ============================================================
K_HUE = '#A78BFF'

with open('/tmp/kkbox/models/training_metrics.json') as f:
    tm = json.load(f)
with open('/tmp/kkbox/models/calibration_metrics.json') as f:
    cm = json.load(f)

# --- Plate 3: temporal-split model comparison (real metrics) ---
model_metrics = tm['models']
labels = {
    'logistic_regression': 'logistic regression',
    'random_forest': 'random forest',
    'xgboost': 'xgboost',
    'lightgbm': 'lightgbm',
}
items = [(labels[k], v['auc']) for k, v in model_metrics.items() if k in labels]
items.sort(key=lambda kv: kv[1])

fig, ax = plt.subplots(figsize=(16, 9))
ypos = np.arange(len(items))
for i, (name, auc) in enumerate(items):
    ax.barh(i, auc, height=0.45, color=K_HUE if i == len(items) - 1 else '#4A3D73',
            linewidth=0)
    ax.annotate(f'{auc:.3f}', (auc, i), xytext=(8, 0), textcoords='offset points',
                va='center', color=TEXT_BRIGHT, fontsize=12)
ax.set_yticks(ypos)
ax.set_yticklabels([n for n, _ in items], fontsize=12, color=TEXT_MID)
ax.set_xlim(0.5, 1.02)
ax.set_xlabel('auc · temporal split · 1.9M train / 971k validation samples', labelpad=12)
ax.grid(axis='y', visible=False)
save(fig, 'plate-kkbox-models.png')

# --- Plate 4: isotonic calibration improvement (real metrics) ---
fig, ax = plt.subplots(figsize=(16, 9))
rows = []
for mkey, label in [('lightgbm', 'lightgbm'), ('xgboost', 'xgboost')]:
    if mkey in cm:
        rows.append((label + ' · brier', cm[mkey]['before']['brier'], cm[mkey]['after']['brier']))
        rows.append((label + ' · log loss', cm[mkey]['before']['log_loss'], cm[mkey]['after']['log_loss']))

for i, (label, before, after) in enumerate(rows):
    ax.plot([before, after], [i, i], color=(1, 1, 1, 0.18), linewidth=1.5, zorder=1)
    ax.plot(before, i, 'o', color='#4A3D73', markersize=9, zorder=5)
    ax.plot(after, i, 'o', color=K_HUE, markersize=9, zorder=5)
    ax.annotate(f'{before:.3f}', (before, i), xytext=(0, 12), textcoords='offset points',
                ha='center', color=TEXT_QUIET, fontsize=10)
    ax.annotate(f'{after:.3f}', (after, i), xytext=(0, 12), textcoords='offset points',
                ha='center', color=TEXT_BRIGHT, fontsize=10)
ax.set_yticks(range(len(rows)))
ax.set_yticklabels([r[0] for r in rows], fontsize=12, color=TEXT_MID)
ax.set_xlabel('isotonic calibration · before → after', labelpad=12)
ax.grid(axis='y', visible=False)
ax.set_ylim(-0.6, len(rows) - 0.4)
ax.invert_yaxis()
save(fig, 'plate-kkbox-calibration.png')

print('done')
