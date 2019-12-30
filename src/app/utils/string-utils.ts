/**
 * String utils contains auxiliary methods for string manipulation.
 */
export class StringUtils {
    /**
     * Prepare a string for a search comparison.
     *
     * @param keywords Keywords inserted by the user.
     * @return Version of the string ready for comparison.
     */
    public static prepareKeyword(keywords) {
        return StringUtils.accentFolding(StringUtils.removePunctuation(keywords.toLowerCase()));
    }

    /**
     * Split a string into multiple keywords for comparison.
     *
     * @param searchText Search text to be processed.
     * @return Array of already prepared keywords.
     */
    public static splitKeywords(searchText) {
        var keywords = searchText.split(' ');
        var j = 0;

        while (j < keywords.length) {
            if (keywords[j].length === 0) {
                keywords.splice(j, 1);
            } else {
                keywords[j] = StringUtils.prepareKeyword(keywords[j]);
                j++;
            }
        }

        return keywords;
    }

    /**
     * Check if for keywords in attributes of an object..
     *
     * It ignores the character casing, punctuation and accenting.
     *
     * @param searchText Keywords inserted by the user.
     * @param object Object to serach in.
     * @param attributes Array of attributes of the object to be checked.
     * @return True if the two strings match, false otherwise.
     */
    public static searchObject(searchText, object, attributes) {
        if (searchText === null || object === null || searchText.length === 0) {
            return true;
        }

        var keywords = StringUtils.splitKeywords(searchText);

        // Iterate attributes and search text
        for (var i = 0; i < attributes.length; i++) {
            var attribute = object[attributes[i]];
            if (attribute !== undefined && attribute !== null) {
                attribute = StringUtils.prepareKeyword(JSON.stringify(attribute));
                for (var j = 0; j < keywords.length; j++) {
                    if (attribute.search(keywords[j]) !== -1) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Check if two string are similar for search.
     *
     * It ignores the character casing, punctuation and accenting.
     *
     * @param searchText Keywords inserted by the user.
     * @param text Text to be compared against the keywords provided.
     * @return True if the two strings match, false otherwise.
     */
    public static search(searchText, text) {
        if (text === null || text === undefined) {
            return false;
        }

        var keywords = StringUtils.splitKeywords(searchText);

        text = StringUtils.prepareKeyword(text);

        for (var j = 0; j < keywords.length; j++) {
            if (text.search(keywords[j]) !== -1) {
                return true;
            }
        }

        return false;
    }

    /**
     * Change accents in strings to use non accented chars. Only works for lowercase strings.
     *
     * Useful for string comparison in searches.
     *
     * @param str Input string to be processed.
     * @return Processed string without accented chars.
     */
    public static accentFolding(str) {
        // tslint:disable-next-line:no-shadowed-variable
        return str.replace(/([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, function (str, a, c, e, i, n, o, s, u, y, ae) {
            if (a) {
                return 'a';
            }
            if (c) {
                return 'c';
            }
            if (e) {
                return 'e';
            }
            if (i) {
                return 'i';
            }
            if (n) {
                return 'n';
            }
            if (o) {
                return 'o';
            }
            if (s) {
                return 's';
            }
            if (u) {
                return 'u';
            }
            if (y) {
                return 'y';
            }
            if (ae) {
                return 'ae';
            }
        });
    }

    /**
     * Remove all the punctuation and spaces from a string.
     *
     * Useful for string comparison in searches.
     *
     * @param str Input string to be processed.
     * @return Processed string without accented chars.
     */
    public static removePunctuation(str) {
        return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~() ]/g, '');
    }
}

