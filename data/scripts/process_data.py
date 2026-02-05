import json
import re

def process():
    # 1. 加载分类信息
    category_map = {}
    with open('data/category-info.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        if lines:
            for line in lines[1:]:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    category_id = parts[0]
                    category_name = parts[1]
                    category_map[category_id] = category_name

    # 2. 加载数据文件
    with open('data/理论资源导航及子孙栏目数据.txt', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 3. 处理并输出 Markdown 表格
    results = []
    results.append("| 标题 | 地址 URL | 分类名称 |")
    results.append("| :--- | :--- | :--- |")
    
    link_pattern = re.compile(r"<a href=['\"](.*?)['\"].*?>(.*?)</a>")
    
    for item in data:
        source = item.get('_source', {})
        show_title_html = source.get('showTitle', '')
        category_id = source.get('categoryId', '')
        
        match = link_pattern.search(show_title_html)
        if match:
            url = match.group(1)
            title = match.group(2)
            category_name = category_map.get(category_id, '未知分类')
            # 过滤掉“头图及栏目图”之类可能干扰的条目（如果有残留）
            if category_name != "头图及栏目图":
                results.append(f"| {title} | {url} | {category_name} |")

    with open('output_navigation.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(results))

if __name__ == "__main__":
    process()
