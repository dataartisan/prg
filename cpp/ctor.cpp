#include <iostream>

using namespace std;
class A
{
protected:
  int i;
public:
  A(int x)
  { i = x; }
};

class B
{
public:
  int stringToInt(string s) { return s.size(); }

  B()
  {a = A(5);}
private:
  A a;
//   B(std::string aStr)
//     :A(stringToInt(aStr))
//   { cout << i << endl;  }
};

int main()
{
  B b;
  return 0;
}
