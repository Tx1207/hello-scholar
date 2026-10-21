# <Method name>: <paper title>

<Authors> · <Venue and year>

[Paper](<url>) · [Project page](<url>) · [Weights](<url>) · [Citation](#citation)

<One figure or headline result that shows what the method does. Prefer one clear figure to a row of badges.>

<Two or three sentences: the problem, what the method changes, and the headline result with its condition, for example "-23.4% BD-rate against VTM-17.0 on UVG, all frames, intra period -1".>

## Installation

Tested with <OS>, Python <version>, CUDA <version>, PyTorch <version>.

```bash
git clone <public repository URL>
cd <repository>
conda env create -f environment.yml   # or: pip install -r requirements.txt
conda activate <env>
```

<Add build steps for native extensions only when they exist, with the exact versions they need.>

## Quick start

<The shortest path from a fresh clone to a real output with released weights: one command or a few lines of code, plus what the reader should see.>

```bash
python scripts/<entry>.py --config configs/<config>.yaml --ckpt weights/<model>.pt --input <example>
```

## Pretrained models

| Model | Used for | Download |
| --- | --- | --- |
| <name> | <Table and row it reproduces> | [link](<url>) |

<State the license of the weights when it differs from the code license.>

## Data

<Where to obtain each dataset, its license, and the directory layout the code expects. Do not redistribute data without the right to do so.>

```text
data/
└── <dataset>/
    └── <expected layout>
```

## Reproducing the paper results

<One row per released claim. Evaluation from released weights comes first because it is cheap; training follows.>

| Paper result | Command | Expected |
| --- | --- | --- |
| <Table 2, UVG, DISTS> | `python scripts/eval.py --config configs/uvg.yaml --ckpt weights/main.pt` | <0.081 ± 0.002> |

<Write the evaluation conditions that change the numbers and decide whether a comparison with other methods is fair: data split, frame count, crop or padding, intra period, rate points, metric implementation, and hardware for timing.>

## Training

<The command per released model, the hardware and wall-clock time it took, and where the hyperparameters live (configs, not code edits). Move long procedures to a separate file such as TRAINING.md and link it here.>

```bash
python scripts/train.py --config configs/<config>.yaml
```

## Repository structure

<Optional; only when it helps a reader find their way. Keep it to the top level.>

```text
src/<pkg>/   reusable model and data code
scripts/     entry points
configs/     experiment configurations
```

## Citation

```bibtex
<BibTeX entry>
```

## License

<Code license. Weights and data licenses when they differ.>

## Acknowledgements

<Code or models this release builds on, with links and their licenses.>
