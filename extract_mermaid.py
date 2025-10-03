import re

with open('README.md', 'r') as f:
    content = f.read()

mermaid_match = re.search(r'```mermaid\n([\s\S]*?)\n```', content)

if mermaid_match:
    mermaid_code = mermaid_match.group(1)
    with open('docs/project_structure.mmd', 'w') as f:
        f.write(mermaid_code)
else:
    print("Mermaid diagram not found in README.md")

