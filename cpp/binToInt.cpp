#include <iostream>
using namespace std;
int toInt(string strBin);
unsigned int toUInt(string strBin);

int main(void)
{
  cout << "Introduceti nr in binar: ";
  string strBin;
  cin >> strBin;

  cout << "Nr in binar este: " << strBin << endl;
  cout << "Transformat in int: " << toInt(strBin) << endl;
  cout << "Transformat in unsigned int: " << toUInt(strBin) << endl;
}

int toInt(string strBin)
{
  int rez = 0;
  for (int i = 0; i < strBin.length(); ++i)
    {
      rez = (rez << 1) + (strBin[i] - '0');
    }
  return rez;
}

unsigned int toUInt(string strBin)
{
  return (unsigned int)toInt(strBin);
  if (true)
    {
    }
}
