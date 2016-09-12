import urllib.request
import re
import json


def get_articles(start, r):
    articles = []
    for i in range(start, start+r):
        with urllib.request.urlopen('http://www.theatlantic.com/national/?page=%d' % i) as response:
            html = response.read()

            articles += ['http://www.theatlantic.com%s' % item for
                         item in list(set(re.findall('(/news/archive/[0-9]{4}/[0-9]+/[A-Za-z-]+/[0-9]+/)', str(html))))]
    return articles


def get_word_list():
    word_list = []
    with open('assets/wordlist.txt', 'r') as wordlistfile:
        for word in wordlistfile:
            word_list.append(word.replace('\n', ''))
    return word_list


def convert_currency(w):
    currency_table = {'$': 'dollars', '£': 'pounds', '€': 'euros', '₹': 'rupees', '¥': 'yen'}
    if w in currency_table:
        return currency_table[w]
    return w


def get_article_texts(articles):
    article_texts = []
    for article in articles:
        with urllib.request.urlopen(article) as response:
            c = response.read()
            article_texts.append([convert_currency(
                re.sub('(\.|,|[0-9]*|\")', '',
                       re.sub('\\\\n', '', re.sub('\\\\r', '', re.sub('<.*?>', '', item)))).replace('\\\'', '\''))
                                  for item in re.findall('<section id.*</p></section>', str(c.decode('unicode_escape')
                                                                                            .encode('ascii', 'ignore')))])
    return article_texts


def write_article_texts(article_texts):
    word_list = get_word_list()
    with open('articletexts.txt', 'a') as article_file:
        for articles in article_texts:
            for part in articles:
                split_part = part.split(' ')
                for word in split_part:
                    if word in word_list and word.isalpha():
                        article_file.write(word + '\n')

write_article_texts(get_article_texts(get_articles(31, 10)))
write_word_associations_to_json(get_word_associations(), 'markovchains.json')
write_word_association_percentages_to_json(get_word_associations(), 'assets/markovpercentages.json')

def get_word_associations():
    word_associations = {}
    with open('articletexts.txt', 'r') as article_file:
        l_article_file = [word.replace('\n', '') for word in list(article_file)]
        for i, word in enumerate(l_article_file):
            if word != '':
                if i == 0:
                    continue
                prev_word = l_article_file[i - 1]
                if prev_word in word_associations:
                    if word in word_associations[prev_word]:
                        word_associations[prev_word][word] += 1
                    else:
                        word_associations[prev_word][word] = 1
                else:
                    word_associations[prev_word] = {}
    return word_associations


def write_word_association_percentages_to_json(word_associations, fp):
    word_percentages = {}
    for word in word_associations:
        word_percentages[word] = {}
        total_uses = sum(word_associations[word].values())
        for nextword in word_associations[word]:
            word_percentages[word][nextword] = word_associations[word][nextword] / total_uses

    with open(fp, 'w') as percent_file:
        json.dump(word_percentages, percent_file, sort_keys=True, indent=4, ensure_ascii=False)


def write_word_associations_to_json(word_associations, fp):
    with open(fp, 'w') as word_json_file:
        json.dump(word_associations, word_json_file, sort_keys=True, indent=4, ensure_ascii=False)


