import { render, screen } from "../../../test-utils/testing-library-utils";
import { HttpResponse, http } from "msw";
import { server } from "../../../mocks/server";
import OrderEntry from "../OrderEntry";
import { userEvent } from "@testing-library/user-event";

test("handles error for scoops and toppings routes", async () => {
  server.resetHandlers(
    http.get("http://localhost:3030/scoops", () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get("http://localhost:3030/toppings", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<OrderEntry />);

  const alerts = await screen.findAllByRole("alert");
  expect(alerts).toHaveLength(2);
});

// 주문한 스쿱이 없으면 주문 입력란 페이지에서 주문 버튼을 비활성화, 토핑으로만된 선데이는 주문 불가
// -> 버튼 비활성화 테스트
test("주문한 스쿱이 없으면 주문 입력란 페이지에서 주문 버튼을 비활성화", async () => {
  const user = userEvent.setup();

  // 앱 렌더링
  render(<OrderEntry />);

  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  await user.clear(chocolateScoop);
  await user.type(chocolateScoop, "0");

  screen.getByText(/Scoops total: \$0.00/i);

  const orderBtn = screen.getByRole("button", { name: "Order Sundae!" });
  expect(orderBtn).toBeDisabled();

  await user.type(chocolateScoop, "5");
  expect(orderBtn).toBeEnabled();

  await user.clear(chocolateScoop);
  await user.type(chocolateScoop, "0");
  expect(orderBtn).toBeDisabled();
});
