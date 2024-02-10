This repo demos a simple template of using [`transformers.js`](https://huggingface.co/docs/transformers.js/en/index) and [Deep Chat](https://deepchat.dev/) to create a demo chat.

## model options

-   To import transformers models through `transformers.js`, you will need a `.onnx` model, e.g., `model.onnx` (preferrably a quantized model, e.g., `model_quantized.onnx`).

    -   [`transformers.js`](https://huggingface.co/docs/transformers.js/en/custom_usage) recommends using the [`conversion script`](https://github.com/xenova/transformers.js/tree/main/scripts) to convert a customized model, e.g., your own pretrained or fine-tuned models.

    ```bash
    # create a python virtual environment
    python venv .vent
    # install required packages
    pip3 install -r requirements.txt
    # run the conversion script
    python -m scripts.convert --quantize --model_id <modelid>
    ```

    -   In this demo, we used a [custom gpt2-small (124MM parms)](https://huggingface.co/shi-zheng-qxhs/gpt2_oasst2_curated_onnx) fine-tuned on a conversational dataset, i.e., [`oasst2`](https://huggingface.co/datasets/sablo/oasst2_curated). This model was fine-tuned on a NVIDIA Tesla T4 GPU for 20 epochs.

## download project

```bash
# clone git repository
git clone https://github.com/shizheng-rlfresh/slm-rag.git
# go to the directory and install dependency
npm install
```

## development mode

```bash
# start a serve on localhost
npm run dev -- --open

# build app
npm run build

# preview
npm run preview
```
